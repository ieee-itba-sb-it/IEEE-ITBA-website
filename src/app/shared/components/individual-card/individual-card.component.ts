import {IEEEMember} from '../../models/team-member';
import {Component, Input, OnInit} from '@angular/core';
import {InternationalText} from "../../models/data-types";

@Component({
    selector: 'app-individual-card',
    templateUrl: './individual-card.component.html',
    styleUrls: ['./individual-card.component.css']
})
export class IndividualCardComponent implements OnInit {

  @Input() person: IEEEMember;
  @Input() position: InternationalText;

  constructor() {

  }

  ngOnInit(): void {
      if (this.person != null && this.person.linkedin && !this.person.linkedin.startsWith('https://')) {
          this.person.linkedin = 'https://' + this.person.linkedin;
      }
  }

  shouldNotShowPerson() {
      return !!this.person && this.person.name === 'white';
  }
}
