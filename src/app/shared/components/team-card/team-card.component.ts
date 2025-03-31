import { Component, Input } from '@angular/core';
import {Commission} from "../../models/commission";

@Component({
    selector: 'app-team-card',
    templateUrl: './team-card.component.html',
    styleUrls: ['./team-card.component.css']
})
export class TeamCardComponent {
    white = false;

  @Input() team: Commission;

  constructor() {}

}
