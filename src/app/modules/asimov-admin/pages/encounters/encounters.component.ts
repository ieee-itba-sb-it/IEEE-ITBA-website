import { Component } from '@angular/core';
import {Encounter} from "../../../../shared/models/event/asimov/encounter";
import {Observable} from "rxjs";
import {Prediction} from "../../../../shared/models/event/asimov/score";
import {Robot} from "../../../../shared/models/event/asimov/robot";

@Component({
  selector: 'app-encounters',
  templateUrl: './encounters.component.html',
  styleUrls: ['./encounters.component.css']
})
export class EncountersComponent {
    private areVotationOpen$: Observable<boolean>;
    private encounters$: Observable<Encounter[]>;
    private predictions$: Observable<Prediction[]>;
    private robots$: Observable<Robot>[];

    private setWinner(encounter: Encounter, robot: Robot): void {

    }
}
