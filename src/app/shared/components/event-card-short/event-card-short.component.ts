import {Component, Input, OnInit} from '@angular/core';
import {Event, EventDate, EventStatus} from '../../models/event/event';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-event-card-short',
    templateUrl: './event-card-short.component.html',
    styleUrls: ['./event-card-short.component.css']
})
export class EventCardShortComponent implements OnInit {

  @Input() event: Event;

  @Input() index: number;

  hasPrimaryColorIndex: boolean;

  constructor(
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
      this.hasPrimaryColorIndex = this.isPrimaryColorIndex(this.index);
  }

  isPrimaryColorIndex(index: number): boolean {   // 0 -> primary, 1 -> secondary, 2 -> primary, ...
      return index % 2 === 0;
  }

  locale(): string {
      return this.translate.currentLang;
  }

  capitalizeFirstLetter(str: string): string {
      return str.charAt(0).toUpperCase() + str.slice(1);
  }

  getEventDate(): string {
      const openingDate = this.event.dates[EventDate.OPENING];
      if (openingDate.status === EventStatus.CONFIRMED) {
          const date = openingDate.date;
          return this.capitalizeFirstLetter(date.toLocaleDateString(this.locale(), {month: 'long', timeZone: 'UTC'})) + ' ' + date.getFullYear();
      }
      if (openingDate.status === EventStatus.TENTATIVE) {
          const fakeDate = new Date(new Date().getFullYear(), openingDate.month);
          return this.capitalizeFirstLetter(fakeDate.toLocaleDateString(this.locale(), {month: 'long', timeZone: 'UTC'})) + ' ' + fakeDate.getFullYear();
      }
      if (openingDate.status === EventStatus.UPCOMING) {
          return openingDate.year.toLocaleString();
      }
      return this.translate.instant('EVENTS.STATUS.UNSCHEDULED');
  }
}
