import { Component, OnInit } from '@angular/core';
import {EventCardData} from '../../../../shared/models/event/event-card-data';
import {EventService} from '../../../../core/services/event/event.service';

@Component({
  selector: 'app-ras',
  templateUrl: './ras.component.html',
  styleUrls: ['./ras.component.css'],
})
export class RasComponent implements OnInit {

  events: EventCardData[];

  constructor(private eventService: EventService) {

  }

  ngOnInit(): void {
    this.events = this.eventService.getRasEvents();
  }
}
