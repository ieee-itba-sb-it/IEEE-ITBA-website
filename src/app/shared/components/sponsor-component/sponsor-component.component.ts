import { Component, Input, OnInit } from '@angular/core';
import { SponsorsService } from 'src/app/core/services/sponsors/sponsors.service';
import { Team } from 'src/app/shared/models/team';
import {Sponsor} from 'src/app/shared/models/sponsors';

@Component({
    selector: 'app-sponsor-component',
    templateUrl: './sponsor-component.component.html',
    styleUrls: ['./sponsor-component.component.css']
})
export class SponsorComponentComponent implements OnInit {

  @Input() currentsponsor: Sponsor[];

  constructor() {
  }

  ngOnInit(): void {

  }

}
