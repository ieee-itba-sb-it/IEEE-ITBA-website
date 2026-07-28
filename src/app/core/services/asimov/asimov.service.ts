import { Injectable } from '@angular/core';
import {
    collection,
    collectionGroup,
    CollectionReference,
    doc,
    DocumentData,
    Firestore, getDoc,
    getDocs,
    limit, onSnapshot,
    orderBy,
    Query,
    query,
    QueryConstraint,
    QuerySnapshot,
    runTransaction, setDoc,
    startAfter, updateDoc, where,
    writeBatch,
    WriteBatch
} from "@angular/fire/firestore";
import { Encounter } from "../../../shared/models/event/asimov/encounter";
import { Robot } from "../../../shared/models/event/asimov/robot";
import {filter, map, Observable, of, shareReplay, switchMap, take, tap, throwError, zip} from "rxjs";
import { fromPromise } from "rxjs/internal/observable/innerFrom";
import { Category } from '../../../shared/models/event/asimov/category';
import { v4 as uuid } from 'uuid';
import {Prediction, Score} from "../../../shared/models/event/asimov/score";
import { StorageService } from '../storage/storage.service';
import { UserStorageService } from '../storage/user-storage.service'
import {IEEEuser} from "../../../shared/models/ieee-user/ieee-user";
import axios from "axios";
import { environment } from "../../../../environments/environment";
import {AuthService} from "../authorization/auth.service";

type WinnerEncounters = Encounter[];

@Injectable({
    providedIn: 'root'
})
export class AsimovService {
    private static readonly ENCOUNTERS_COLLECTION_NAME = 'asimov-encounters';
    private encountersCollection: CollectionReference = collection(this.afs, AsimovService.ENCOUNTERS_COLLECTION_NAME);

    private static readonly SCORE_COLLECTION_NAME = 'asimov-scores';
    private scoresCollection: CollectionReference = collection(this.afs, AsimovService.SCORE_COLLECTION_NAME);

    private static readonly ROBOT_COLLECTION_NAME = 'asimov-robots';
    private robotsCollection: CollectionReference = collection(this.afs, AsimovService.ROBOT_COLLECTION_NAME);

    private static readonly CATEGORY_COLLECTION_NAME = 'asimov-categories';
    private categoriesCollection: CollectionReference = collection(this.afs, AsimovService.CATEGORY_COLLECTION_NAME);

    private static readonly PREDICTIONS_COLLECTION_NAME = 'predictions';
    private predictionsCollection: Query = collectionGroup(this.afs, AsimovService.PREDICTIONS_COLLECTION_NAME);

    private static readonly METADATA_COLLECTION_NAME = 'collection-metadata';
    private metadataCollection: CollectionReference = collection(this.afs, AsimovService.METADATA_COLLECTION_NAME);

    private static readonly SCORE_DOCUMENT_NAME = AsimovService.SCORE_COLLECTION_NAME;

    private static readonly PAGE_SIZE = 10;

    private static readonly ROBOTS_CACHE_KEY = "robots";
    private static readonly CATEGORIES_CACHE_KEY = "categories";
    private static readonly CLICO_USER_CACHE_KEY = "clico_user";
    private static readonly PREDICTIONS_CACHE_KEY = "predictions";

    private static readonly DEFAULT_USER_ID = "DEFAULT_UID";

    // checked
    private robotsCache = new Map<string, Observable<Robot[]>>();
    // checked
    private categoriesCache = new Map<string, Observable<Category[]>>();
    //checked
    private clicoUserExistsCache = new Map<string, Observable<boolean>>();

    private predictionCache = new Map<string, Observable<Prediction[]>>();

    private cache = new Map<string, Map<string, Observable<unknown>>>([
        [AsimovService.ROBOTS_CACHE_KEY, this.robotsCache],
        [AsimovService.CATEGORIES_CACHE_KEY, this.categoriesCache],
        [AsimovService.CLICO_USER_CACHE_KEY, this.clicoUserExistsCache],
        [AsimovService.PREDICTIONS_CACHE_KEY, this.predictionCache],
    ]);

    private clearRobotsCache(): void {
        this.cache.get(AsimovService.ROBOTS_CACHE_KEY).clear();
        this.userStorage.remove(AsimovService.DEFAULT_USER_ID, AsimovService.ROBOTS_CACHE_KEY);
    }

    private clearCategoriesCache(): void {
        this.cache.get(AsimovService.CATEGORIES_CACHE_KEY).clear();
        this.userStorage.remove(AsimovService.DEFAULT_USER_ID, AsimovService.CATEGORIES_CACHE_KEY);
    }

    private setCache(userId: string, value: unknown, cache_key: string): void {
        this.cache.get(cache_key).set(userId, of(value).pipe(shareReplay(1)));
        this.userStorage.set(userId, cache_key, value);
    }

    private getCache(userId: string, cache_key: string): Observable<unknown> | null {
        const cache_entry = this.cache.get(cache_key);
        // Check in-memory cache
        if(cache_entry.get(userId)) {
            return cache_entry.get(userId);
        }

        const cached = this.userStorage.get(userId, cache_key);

        // Check localStorage cache
        if(cached) {
            cache_entry.set(userId, of(cached).pipe(
                shareReplay(1)
            ));
            return cache_entry.get(userId);
        }
        return null;
    }

    constructor(private afs: Firestore, private authService: AuthService, private supabaseStorage: StorageService, private userStorage: UserStorageService) {}

    public getPredictionsStatus(): Observable<boolean> {
        return this.getCategories().pipe(
            map(categories => categories.some(category => category.predictionsOpen))
        );
    }

    public setPredictionsStatus(status: boolean): Observable<void> {
        return fromPromise(setDoc(doc(this.metadataCollection, AsimovService.SCORE_DOCUMENT_NAME), {
            open: status
        }));
    }

    public getCheckClicoAccountStatus(): Observable<boolean> {
        return fromPromise(getDoc(doc(this.metadataCollection, AsimovService.SCORE_DOCUMENT_NAME))).pipe(
            map(docSnap => (docSnap.data() as { checkingClicoAccountStatus: boolean }).checkingClicoAccountStatus)
        );
    }

    public setCheckClicoAccountStatus(status: boolean): Observable<void> {
        return fromPromise(updateDoc(doc(this.metadataCollection, AsimovService.SCORE_DOCUMENT_NAME), {
            checkingClicoAccountStatus: status
        }));
    }

    public checkClicoUserExists(user: IEEEuser): Observable<boolean> {
        if(!user)
            throwError(() => new Error("No user logged in"));

        const cached_value = this.getCache(user.uID, AsimovService.CLICO_USER_CACHE_KEY) as Observable<boolean>;
        if(cached_value === null) {
            return fromPromise(
                axios.post(
                    `${environment.clicoApiUrl}/check-email`,
                    { email: user.email },
                )
            ).pipe(
                map(response => response.data.exists as boolean),
                tap(exists => {
                    // False is never cached
                    if(exists) {
                        this.setCache(user.uID, exists, AsimovService.CLICO_USER_CACHE_KEY);
                    }
                }),
                shareReplay(1));
        }
        return cached_value;
    }

    public getEncounters(): Observable<Encounter[]> {
        return fromPromise(getDocs(query(this.encountersCollection))).pipe(
            map(snap =>
                snap.docs.map(doc => doc.data() as Encounter)
            ),
        );
    }

    // This is a live observable. Should explicitely unsuscribe after non usage
    public getLiveEncounters(): Observable<{ all: Encounter[], winnerChanges: WinnerEncounters }> {
        return new Observable<{ all: Encounter[], winnerChanges: WinnerEncounters }>((sub) => {
            const unsub = onSnapshot(query(this.encountersCollection), (snapshot) => {
                console.log(snapshot);
                sub.next({
                    all: snapshot.docs.map(doc => doc.data() as Encounter),
                    winnerChanges: snapshot.docChanges().filter((docChange) => docChange.type === 'modified').map((doc) => doc.doc.data() as Encounter) ?? []
                });
            });
            return () => {
                unsub();
            };
        })
    }

    public getEncountersByCategoryId(categoryId): Observable<Encounter[]> {
        return fromPromise(getDocs(query(this.encountersCollection, where("category.id", "==", categoryId)))).pipe(
            map(snap =>
                snap.docs.map(doc => doc.data() as Encounter)
            ),
        );
    }

    public getScores(): Observable<Score[]> {
        return new Observable((subscriber) => {
            onSnapshot(query(this.scoresCollection, orderBy("score")), (snap)=>{
                subscriber.next(snap.docs.map(doc => doc.data() as Score))
            })
        })
    }

    public getPredictions(): Observable<Prediction[]> {
        return fromPromise(getDocs(query(this.predictionsCollection))).pipe(
            map(snap =>
                snap.docs.map(doc => doc.data() as Prediction)
            ),
        );
    }

    public getUserPredictions(userId: string): Observable<Prediction[]> {
        return this.authService.getCurrentUser().pipe(
            take(1),
            switchMap(user => {
                // Check if predictions are cached
                const cached_value = this.getCache(user.uID, AsimovService.PREDICTIONS_CACHE_KEY) as Observable<Prediction[]>;
                if(cached_value === null) {
                    // If not, request backend and store predictions in cache
                    return fromPromise(getDocs(query(this.predictionsCollection))).pipe(
                        map(snap =>
                            snap.docs.map(doc => doc.data() as Prediction)
                        ),
                        tap(predictions => this.setCache(userId, predictions, AsimovService.PREDICTIONS_CACHE_KEY)),
                        shareReplay(1));
                }
                return cached_value;
            })
        );
    }

    public getRobots(): Observable<Robot[]> {
        // Check if robots are already cached
        const cached_value = this.getCache(AsimovService.DEFAULT_USER_ID, AsimovService.ROBOTS_CACHE_KEY) as Observable<Robot[]>;
        if(cached_value === null) {
            // If not, request backend and store robots in cache
            return fromPromise(getDocs(query(this.robotsCollection))).pipe(
                map(snap =>
                    snap.docs.map(doc => doc.data() as Robot)
                ),
                tap(robots => this.setCache(AsimovService.DEFAULT_USER_ID, robots, AsimovService.ROBOTS_CACHE_KEY)),
                shareReplay(1));
        }
        return cached_value;
    }

    public getRobotsByCategoryId(categoryId: string): Observable<Robot[]> {
        // This is an optimization for caching all robots at once
        return this.getRobots().pipe(
            map(robots => robots.filter(robot => robot.category.id === categoryId))
        );
    }

    public getCategories(): Observable<Category[]> {
        // Check if categories are already cached
        const cached_value = this.getCache(AsimovService.DEFAULT_USER_ID, AsimovService.CATEGORIES_CACHE_KEY) as Observable<Category[]>;
        if(cached_value === null) {
            // If not, request backend and store categories in cache
            return fromPromise(getDocs(query(this.categoriesCollection))).pipe(
                map(snap =>
                    snap.docs.map(doc => doc.data() as Category)
                ),
                tap(categories => this.setCache(AsimovService.DEFAULT_USER_ID, categories, AsimovService.CATEGORIES_CACHE_KEY)),
                shareReplay(1));
        }
        return cached_value;
    }

    public getRobotsPage(query: Query): Observable<Robot[]> {
        return fromPromise(getDocs(query)).pipe(
            map((snap: QuerySnapshot<DocumentData>) => {
                return snap.docs.map(doc => (doc.data() as Robot));
            })
        );
    }

    public getRobotsNextPage(last: Robot | null): Observable<Robot[]> {
        const constraints: QueryConstraint[] = [limit(AsimovService.PAGE_SIZE), orderBy('id'), startAfter(last.id)];
        return this.getRobotsPage(query(this.robotsCollection, ...constraints));
    }

    public getRobotsFirstPage(): Observable<Robot[]> {
        const constraints: QueryConstraint[] = [limit(AsimovService.PAGE_SIZE)];
        return this.getRobotsPage(query(this.robotsCollection, ...constraints));
    }

    public addRobots(robots: Robot[]): Observable<Robot[]> {
        this.clearRobotsCache();
        return new Observable(obs => {
            const batch = writeBatch(this.afs);
            robots.forEach(robot => {
                robot.id = uuid();
                batch.set(doc(this.robotsCollection, robot.id), robot);
            });
            batch.commit().then(res => {
                obs.next(robots);
            }).catch(err => {
                obs.error(err);
            }).finally(() => {
                obs.complete();
            });
        });
    }

    public addRobot(robot: Robot): Observable<Robot> {
        this.clearRobotsCache();
        robot.id = uuid();
        return new Observable(obs => {
            setDoc(
                doc(this.afs, AsimovService.ROBOT_COLLECTION_NAME, robot.id),
                robot
            )
                .then(() => obs.next(robot))
                .catch((err) => obs.error(err));
        });
    }

    public deleteRobots(robots: Robot[]): Observable<boolean> {
        this.clearRobotsCache();
        return new Observable(obs => {
            let batch = writeBatch(this.afs);
            for(let robot of robots) {
                batch.delete(
                    doc(this.afs, AsimovService.ROBOT_COLLECTION_NAME, robot.id)
                );
            }
            batch.commit()
                .then(() => {
                    obs.next(true);
                })
                .catch((err) => {
                    obs.next(false);
                    obs.error(err);
                });
        });
    }

    public updateRobot(newRobot: Robot): Observable<boolean> {
        this.clearRobotsCache();
        return new Observable<boolean>((subscriber) => {
            let data = { ...newRobot };
            updateDoc(doc(this.afs, AsimovService.ROBOT_COLLECTION_NAME, newRobot.id), data)
                .then(() => {
                    subscriber.next(true);
                })
                .catch((err) => {
                    subscriber.next(false);
                    subscriber.error(err);
                })
                .finally(() => subscriber.complete());
        })
    }

    public updateRobotPic(robot: Robot, images: Map<string, {base64?: string, type?: string}>) : Observable<string> {
        const pictureData = images.get(robot.id);
        return new Observable<string>((subscriber) => {
            if(!pictureData.base64 || pictureData.base64.trim() == "" || !pictureData.type) {
                this.supabaseStorage.delete(robot.photo)
                    .then(() => {
                        subscriber.next(null);
                    })
                    .catch((err) => {
                        subscriber.error(err);
                    })
                    .finally(() => subscriber.complete());
            } else {
                const serverpath = `asimov/${robot.id}.${pictureData.type}`;
                fetch(pictureData.base64)
                    .then(image => image.blob())
                    .then(blob => this.supabaseStorage.upload(serverpath, blob, `image/${pictureData.type}`))
                    .then(newURL => {
                        subscriber.next(newURL);
                    })
                    .catch(err => {
                        subscriber.error(err);
                    })
                    .finally(() => subscriber.complete());
            }
        });
    }

    public addCategory(category: Partial<Category>): Observable<Category> {
        this.clearCategoriesCache();
        const id = uuid();
        const newCategory: Category = { id, name: category.name || '', predictionsOpen: false };
        return new Observable<Category>(observer => {
            const ref = doc(this.categoriesCollection, id);
            writeBatch(this.afs).set(ref, newCategory).commit()
                .then(() => {
                    observer.next(newCategory);
                    observer.complete();
                })
                .catch(err => observer.error(err));
        });
    }

    public deleteCategory(category: Category): Observable<void> {
        this.clearCategoriesCache();
        return new Observable<void>(observer => {
            const ref = doc(this.categoriesCollection, category.id);
            writeBatch(this.afs).delete(ref).commit()
                .then(() => {
                    observer.next();
                    observer.complete();
                })
                .catch(err => observer.error(err));
        });
    }

    public updateCategory(category: Category): Observable<boolean> {
        this.clearCategoriesCache();
        return new Observable<boolean>((subscriber) => {
            let data = { ...category };
            updateDoc(doc(this.afs, AsimovService.CATEGORY_COLLECTION_NAME, category.id), data)
                .then(() => {
                    subscriber.next(true);
                })
                .catch((err) => {
                    subscriber.next(false);
                    subscriber.error(err);
                })
                .finally(() => subscriber.complete());
        });
    }

    private checkEncounter(encounter: Encounter, robots: Robot[]): void {
        if (robots.find(r => r.id == encounter.robot1) == null) throw new Error();
        if (robots.find(r => r.id == encounter.robot2) == null) throw new Error();
    }

    private getEncounterWinnerId(encounter: Encounter): string {
        if (encounter.winner == 1) return encounter.robot1;
        if (encounter.winner == 2) return encounter.robot2;
        if (encounter.winner != null) throw new Error();
    }

    private checkEncountersRecursive(encounters: Encounter[], robots: Robot[], hasStarted: boolean, level: number, order: number, lastRobotId: string): void {
        let filteredEncounters = encounters.filter(encounter => encounter.level == level && encounter.order == order);
        if (filteredEncounters.length > 1) throw new Error();
        let encounter = filteredEncounters[0];
        if (encounter != null) hasStarted = true;
        if (hasStarted) {
            if (encounter == null) return;
            this.checkEncounter(encounter, robots)
            let winner = this.getEncounterWinnerId(encounter);
            if (lastRobotId != null && winner != lastRobotId) throw new Error();
        }
        this.checkEncountersRecursive(encounters, robots, hasStarted, level + 1, order * 2, encounter ? encounter.robot1 : null);
        this.checkEncountersRecursive(encounters, robots, hasStarted, level + 1, order * 2 + 1, encounter ? encounter.robot2 : null);
    }

    private checkEncounters(encounters: Encounter[], robots: Robot[]) {
        if (encounters.length < 1) return;
        this.checkEncountersRecursive(encounters, robots, false, 0, 0, null);
    }

    private calculateScore(encounters: Encounter[], predictions: Prediction[]): number {
        let uid: string = predictions[0].uID;
        let score: number = 0;
        for (let prediction of predictions) {
            if (uid != prediction.uID) throw new Error();
            if (predictions.filter(p => p.level == prediction.level && p.order == prediction.order && p.category.id == prediction.category.id).length != 1) return 0;
            let filteredEncounters = encounters.filter(e => e.level == prediction.level && e.category.id == prediction.category.id);
            let winners = filteredEncounters.map(e => this.getEncounterWinnerId(e));
            if (winners.includes(prediction.winner)) score += Math.max(10 - prediction.level * 2, 2);
        }
        return score;
    }

    private async multiWriteBatch<T>(objects: T[], iterator: (batch: WriteBatch, object: T) => void): Promise<void> {
        const chunkSize: number = 500;
        let batches: Promise<void>[] = [];
        for (let i = 0; i < objects.length; i += chunkSize) {
            const chunk = objects.slice(i, i + chunkSize);
            const batch = writeBatch(this.afs);
            chunk.forEach((object) => iterator(batch, object));
            batches.push(batch.commit());
        }
        return Promise.all(batches).then();
    }

    public setEncounters(encounters: Encounter[], deletedEncounters: Encounter[], robots: Robot[]): Observable<void> {
        // Validamos los encuentros y les asignamos un ID si no lo tienen
        this.checkEncounters(encounters, robots);
        encounters.map(encounter => {
            if (encounter.id == null) encounter.id = uuid();
        });
        return fromPromise(
            // Guardamos los encuentros y eliminamos los que se hayan marcado como borrados (de una sola categoría)
            Promise.all([
                this.multiWriteBatch(encounters, (batch, encounter) => {
                    batch.set(doc(this.encountersCollection, encounter.id), encounter);
                }),
                this.multiWriteBatch(deletedEncounters, (batch, encounter) => {
                    batch.delete(doc(this.encountersCollection, encounter.id));
                })
            ])
        ).pipe(
            // Traemos TODOS los encuentros y predicciones
            switchMap(() => zip(this.getPredictions(), this.getEncounters())),
            // Calculamos los puntajes de cada usuario y los actualizamos
            switchMap(([predictions, totalEncounters]) => {
                let predictionsByUser = new Map<string, Prediction[]>();
                let scores: Score[] = [];
                predictions.forEach(prediction => {
                    if (predictionsByUser.get(prediction.uID) == null) predictionsByUser.set(prediction.uID, []);
                    predictionsByUser.get(prediction.uID).push(prediction);
                });
                predictionsByUser.forEach((userPredictions, uID) => {
                    scores.push({
                        uID,
                        fullname: userPredictions[0].fullname,
                        score: this.calculateScore(totalEncounters, userPredictions)
                    });
                });
                return fromPromise(this.multiWriteBatch(scores, (batch, score) => {
                    batch.set(doc(this.scoresCollection, score.uID), score);
                }));
            })
        );
    }

    public savePredictions(predictions: Prediction[]): Observable<Prediction[]> {
        const userId: string = predictions[0].uID;
        const fullname: string = predictions[0].fullname;
        return new Observable(subscriber => {
            const batch = writeBatch(this.afs);
            batch.set(doc(this.scoresCollection, userId), {
                uID: userId,
                fullname: fullname,
                score: 0 // Initial score, will be calculated later
            });
            predictions.forEach(prediction => {
                const userDocRef = doc(this.scoresCollection, prediction.uID);
                const predictionsSubcollection = collection(userDocRef, AsimovService.PREDICTIONS_COLLECTION_NAME);
                const predictionRef = doc(predictionsSubcollection, prediction.id);

                batch.set(predictionRef, prediction);
            });
            batch.commit().then(() => {
                subscriber.next(predictions);
                subscriber.complete();
            }).catch(err => subscriber.error(err)
            ).finally(() => {
                const cache_value: Observable<Prediction[]> = this.getCache(userId, AsimovService.PREDICTIONS_CACHE_KEY) as Observable<Prediction[]>;
                if (cache_value === null)
                    this.setCache(userId, [], AsimovService.PREDICTIONS_CACHE_KEY);

                this.getCache(userId, AsimovService.PREDICTIONS_CACHE_KEY).pipe(
                    map(cachedPredictions => this.setCache(userId, [...cachedPredictions as Prediction[], ...predictions], AsimovService.PREDICTIONS_CACHE_KEY))
                );
            });
        });
    }
}
