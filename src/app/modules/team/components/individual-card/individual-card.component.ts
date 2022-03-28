import { Component, Input, OnInit } from '@angular/core';
import { Person } from 'src/app/shared/models/person/person';

@Component({
  selector: 'app-individual-card',
  templateUrl: './individual-card.component.html',
  styleUrls: ['./individual-card.component.css']
})
export class IndividualCardComponent implements OnInit {

  @Input()
  person: Person = null;

  constructor() { }

  ngOnInit(): void {
  }

  shouldNotShowPerson() {
    return !!this.person && this.person.name === 'white';
  }

}
