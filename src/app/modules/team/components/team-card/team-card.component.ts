import { TeamMember } from './../../../../shared/models/team-member';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-team-card',
  templateUrl: './team-card.component.html',
  styleUrls: ['./team-card.component.css']
})
export class TeamCardComponent {
  white = false;

  @Input()
  team: TeamMember[];

  constructor() { }

}
