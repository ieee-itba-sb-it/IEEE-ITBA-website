import { Injectable } from '@angular/core';
import {
    collection,
    collectionGroup,
    CollectionReference,
    doc,
    DocumentData,
    Firestore,
    getDocs,
    limit, onSnapshot,
    orderBy,
    Query,
    query,
    QueryConstraint,
    QuerySnapshot,
    setDoc,
    startAfter, where,
    writeBatch,
    WriteBatch
} from "@angular/fire/firestore";
import {flatMap, from, mergeMap} from "rxjs";
import { Encounter } from "../../../shared/models/event/asimov/encounter";
import { Robot } from "../../../shared/models/event/asimov/robot";
import { map, Observable, take } from "rxjs";
import { fromPromise } from "rxjs/internal/observable/innerFrom";
import { Category } from '../../../shared/models/event/asimov/category';
import { v4 as uuid } from 'uuid';
import {Prediction, Score} from "../../../shared/models/event/asimov/score";

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

    private static readonly PAGE_SIZE = 10;

    constructor(private afs: Firestore) {}

    public getEncounters(): Observable<Encounter[]> {
        return fromPromise(getDocs(query(this.encountersCollection))).pipe(
            map(snap =>
                snap.docs.map(doc => doc.data() as Encounter)
            ),
        );
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
        return fromPromise(getDocs(query(this.predictionsCollection, where("uID", "==", userId)))).pipe(
            map(snap =>
                snap.docs.map(doc => doc.data() as Prediction)
            ),
        );
    }

    public getRobots(): Observable<Robot[]> {
        return fromPromise(getDocs(query(this.robotsCollection))).pipe(
            map(snap =>
                snap.docs.map(doc => doc.data() as Robot)
            ),
        );
    }

    public getRobotsByCategoryId(categoryId: string): Observable<Robot[]> {
        return fromPromise(getDocs(query(this.robotsCollection, where("category.id", "==", categoryId)))).pipe(
            map(snap =>
                snap.docs.map(doc => doc.data() as Robot)
            ),
        );
    }

    public getCategories(): Observable<Category[]> {
        return fromPromise(getDocs(query(this.categoriesCollection))).pipe(
            map(snap => snap.docs.map(doc => doc.data() as Category))
        );
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

    public addCategory(category: Partial<Category>): Observable<Category> {
        const id = uuid();
        const newCategory: Category = { id, name: category.name || '' };
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
        this.checkEncountersRecursive(encounters, robots, false, 0, 0, null);
    }

    private calculateScore(encounters: Encounter[], predictions: Prediction[]): number {
        let uid: string = predictions[0].uID;
        let score: number = 0;
        for (let prediction of predictions) {
            if (uid != prediction.uID) throw new Error();
            if (predictions.filter(p => p.level == prediction.level && p.order == prediction.order).length != 1) return 0;
            let encounter = encounters.find(e => e.level == prediction.level && prediction.order == prediction.order);
            if (encounter != null) {
                if (this.getEncounterWinnerId(encounter) == prediction.winner) score += Math.max(10 - encounter.level * 2, 2);
            }
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
        return new Observable<void>(subscriber => {
            try {
                this.checkEncounters(encounters, robots);
                this.getPredictions().pipe(take(1)).subscribe(async predictions => {
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
                            score: this.calculateScore(encounters, userPredictions)
                        });
                    })
                    encounters.map(encounter => {
                        if (encounter.id == null) encounter.id = uuid();
                    });
                    await Promise.all([
                        this.multiWriteBatch(scores, (batch, score) => {
                            batch.set(doc(this.scoresCollection, score.uID), score);
                        }),
                        this.multiWriteBatch(encounters, (batch, encounter) => {
                            batch.set(doc(this.encountersCollection, encounter.id), encounter);
                        }),
                        this.multiWriteBatch(deletedEncounters, (batch, encounter) => {
                            batch.delete(doc(this.encountersCollection, encounter.id));
                        }),
                    ])
                    subscriber.next();
                })
            } catch (error) {
                subscriber.error(error);
            }
        })
    }
    public savePredictions(predictions: Prediction[]): Observable<Prediction[]> {
        return new Observable(subscriber => {
            const batch = writeBatch(this.afs);
            batch.set(doc(this.scoresCollection, predictions[0].uID), {
                uID: predictions[0].uID,
                fullname: predictions[0].fullname,
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
            }).catch(err => subscriber.error(err));
        });
    }

}
