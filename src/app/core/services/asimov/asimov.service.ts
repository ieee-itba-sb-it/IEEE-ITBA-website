import { Injectable } from '@angular/core';
import {
    collection,
    collectionGroup,
    CollectionReference, doc, DocumentData,
    Firestore, getDoc,
    getDocs, limit, orderBy,
    Query,
    query, QueryConstraint, QueryDocumentSnapshot, QuerySnapshot, runTransaction, startAfter, startAt, writeBatch
} from "@angular/fire/firestore";
import {Encounter} from "../../../shared/models/event/asimov/encounter";
import {Robot} from "../../../shared/models/event/asimov/robot";
import {flatMap, from, map, mergeMap, Observable} from "rxjs";
import {fromPromise} from "rxjs/internal/observable/innerFrom";
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

    public getScores(): Observable<Score[]> {
        return fromPromise(getDocs(query(this.scoresCollection))).pipe(
            map(snap =>
                snap.docs.map(doc => doc.data() as Score)
            ),
        );
    }

    public getPredictions(): Observable<Prediction[]> {
        return fromPromise(getDocs(query(this.predictionsCollection))).pipe(
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

    private checkEncounter(encounter: Encounter, robots: Robot[]): boolean {
        return true
    }

    public setEncounterS(encounters: Encounter[], scores: Score[], robots: Robot[]): Observable<void> {
        return new Observable<void>(subscriber => {

        })
    }

}
