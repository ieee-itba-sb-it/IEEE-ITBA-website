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
import { v4 as uuid } from 'uuid';

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
        this.checkEncountersRecursive(encounters, robots, hasStarted, level + 1, order * 2, encounter.robot1);
        this.checkEncountersRecursive(encounters, robots, hasStarted, level + 1, order * 2 + 1, encounter.robot2);
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

    private async multiWriteBatch<T>(objects: T[], collection: CollectionReference, identifier: (object: T) => string, ...path: string[]): Promise<void> {
        const chunkSize: number = 500;
        let batches: Promise<void>[] = [];
        for (let i = 0; i < objects.length; i += chunkSize) {
            const chunk = objects.slice(i, i + chunkSize);
            const batch = writeBatch(this.afs);
            chunk.forEach((object) => batch.set(doc(collection, ...path, identifier(object)), object));
            batches.push(batch.commit());
        }
        return Promise.all(batches).then();
    }

    public setEncounters(encounters: Encounter[], robots: Robot[]): Observable<void> {
        return new Observable<void>(subscriber => {
            try {
                this.checkEncounters(encounters, robots);
                this.getPredictions().subscribe(async predictions => {
                    let predictionsByUser: Map<string, Prediction[]> = new Map();
                    let scores: Score[] = [];
                    predictions.forEach(prediction => {
                        if (predictionsByUser[prediction.uID] == null) predictionsByUser[prediction.uID] = [];
                        predictionsByUser[prediction.uID].push(prediction);
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
                        this.multiWriteBatch(scores, this.scoresCollection, s => s.uID),
                        this.multiWriteBatch(encounters, this.encountersCollection, e => e.id)
                    ])
                    subscriber.next();
                })
            } catch (error) {
                subscriber.error(error);
            }
        })
    }

}
