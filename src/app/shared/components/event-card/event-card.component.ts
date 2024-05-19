import {Component, Input, OnInit} from '@angular/core';
import {Event} from '../../models/event/event';

@Component({
    selector: 'app-event-card',
    templateUrl: './event-card.component.html',
    styleUrls: ['./event-card.component.css']
})
export class EventCardComponent implements OnInit {

  @Input() event: Event;

  @Input() index: number;

  hasPrimaryColorIndex: boolean;

  constructor() {}

  ngOnInit(): void {
      this.hasPrimaryColorIndex = this.isPrimaryColorIndex(this.index);
  }

  isPrimaryColorIndex(index: number): boolean {   // 0 -> primary, 1 -> secondary, 2 -> primary, ...
      return index % 2 === 0;
  }

}
