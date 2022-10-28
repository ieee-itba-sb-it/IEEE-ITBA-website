import { Component, OnInit } from '@angular/core';
import { SponsorsService } from 'src/app/core/services/sponsors/sponsors.service';
import { Team } from 'src/app/shared/models/team';
import {Sponsor} from 'src/app/shared/models/sponsors';

@Component({
  selector: 'app-sponsor-component',
  templateUrl: './sponsor-component.component.html',
  styleUrls: ['./sponsor-component.component.css']
})
export class SponsorComponentComponent implements OnInit {

  currentsponsors: Sponsor[]  = null;
  previoussponsors: Sponsor[] = null;
  constructor(private SponsorsService: SponsorsService) {
  }

  ngOnInit(): void {
    this.currentsponsors = this.SponsorsService.getCurrentSponsors();
    this.previoussponsors = this.SponsorsService.getPreviousSponsors();
  }

}
