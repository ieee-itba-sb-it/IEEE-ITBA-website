import { Injectable } from '@angular/core';
import {
    collection,
    collectionGroup,
    CollectionReference, doc,
    Firestore,
    getDocs,
    Query,
    query, runTransaction, writeBatch
} from "@angular/fire/firestore";
import {Encounter} from "../../../shared/models/event/asimov/encounter";
import {Robot} from "../../../shared/models/event/asimov/robot";
import {flatMap, map, mergeMap, Observable} from "rxjs";
import {fromPromise} from "rxjs/internal/observable/innerFrom";
import {Prediction, Score} from "../../../shared/models/event/asimov/score";

@Injectable({
    providedIn: 'root'
})
export class AsimovService {
    private static readonly ENCOUNTERS_COLLECTION_NAME = 'asimov_encounters';
    private encountersCollection: CollectionReference = collection(this.afs, AsimovService.ENCOUNTERS_COLLECTION_NAME);

    private static readonly SCORE_COLLECTION_NAME = 'asimov_scores';
    private scoresCollection: CollectionReference = collection(this.afs, AsimovService.SCORE_COLLECTION_NAME);

    private static readonly ROBOT_COLLECTION_NAME = 'asimov_robots';
    private robotsCollection: CollectionReference = collection(this.afs, AsimovService.ROBOT_COLLECTION_NAME);

    private static readonly PREDICTIONS_COLLECTION_NAME = 'predictions';
    private predictionsCollection: Query = collectionGroup(this.afs, AsimovService.PREDICTIONS_COLLECTION_NAME);

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

    private checkEncounter(encounter: Encounter, robots: Robot[]): boolean {
        return true
    }

    public setEncounterS(encounters: Encounter[], scores: Score[], robots: Robot[]): Observable<void> {
        return new Observable<void>(subscriber => {

        })
    }
    public savePredictions(predictions: Prediction[]): Observable<Prediction[]> {
        return new Observable(subscriber => {
            const batch = writeBatch(this.afs);

            predictions.forEach(prediction => {
                console.log('🧪 Prediction a guardar:', prediction);
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
