import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Score {
    uID: string;
    fullname: string;
    score: number;
}

@Injectable({ providedIn: 'root' })
export class MockAsimovService {
    private scoresSubject = new BehaviorSubject<Score[]>([
        { uID: '1', fullname: 'Alice', score: 100 },
        { uID: '2', fullname: 'Bob', score: 100 },
        { uID: '3', fullname: 'Charlie', score: 100 },
    ]);

    constructor() {
        // Simulate scores increasing randomly every 3 seconds
        interval(3000).subscribe(() => {
            const currentScores = this.scoresSubject.getValue();

            const newScores = currentScores.map(score => {
                // Increase each score by a random number between 0 and 10
                const increment = Math.floor(Math.random() * 11);
                return {
                    ...score,
                    score: score.score + increment
                };
            });

            this.scoresSubject.next(newScores);
        });
    }

    getScores(): Observable<Score[]> {
        return this.scoresSubject.asObservable();
    }
}
