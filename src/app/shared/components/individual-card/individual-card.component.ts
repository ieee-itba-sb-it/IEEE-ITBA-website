import {TeamMember} from '../../models/team-member';
import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-individual-card',
    templateUrl: './individual-card.component.html',
    styleUrls: ['./individual-card.component.css']
})
export class IndividualCardComponent implements OnInit {

  @Input()
      person: TeamMember;

  constructor() { }

  ngOnInit(): void {
  }

  shouldNotShowPerson() {
      return !!this.person && this.person.name === 'white';
  }
}
