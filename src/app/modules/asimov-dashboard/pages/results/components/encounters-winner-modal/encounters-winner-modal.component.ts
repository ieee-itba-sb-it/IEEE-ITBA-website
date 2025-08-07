import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { Encounter } from '../../../../../../shared/models/event/asimov/encounter';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Robot } from '../../../../../../shared/models/event/asimov/robot';
import { NgForOf } from '@angular/common';

export type ModalData = {
  winners: (Omit<Encounter, 'winner'> & { winner: number })[];
  robots: Robot[]; // Should have all robots
}

type ShownData = {
  robot1: Robot;
  robot2: Robot;
  winner: 1 | 2;
}

@Component({
    selector: 'app-encounters-winner-modal',
    standalone: true,
    imports: [NgForOf],
    templateUrl: './encounters-winner-modal.component.html',
    styleUrls: ['./encounters-winner-modal.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EncountersWinnerModalComponent { 
    winners: ShownData[];
    constructor(
      @Inject(MAT_DIALOG_DATA) public data: ModalData
    ) {
        const robotByid = data.robots.reduce((prev, robot) => {
            prev[robot.id] = robot;
            return prev;
        }, {} as Record<string, Robot>)
        this.winners = data.winners.map(({ robot1, robot2, winner }) => {
            return {
                robot1: robotByid[robot1],
                robot2: robotByid[robot2],
                winner: winner === 1 ? 1 : 2,
            };
        });
    }
}
