import { TeamService } from '../../../../core/services/team/team.service';
import { Component, OnInit } from '@angular/core';
import { Team } from 'src/app/shared/models/team';
import {Commission} from '../../../../shared/models/commission';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

  teams: Team[] = null;
  team: Commission[] = null;
  constructor(private teamService: TeamService) {
  }

  ngOnInit(): void {
    this.team = this.teamService.getCurrentTeam();
  }

}
