import {Component, Input, OnInit} from '@angular/core';
import {Event, EventDate, EventStatus} from '../../models/event/event';
import {TranslateService} from '@ngx-translate/core';
import {EventService} from "../../../core/services/event/event.service";
import {Timestamp} from "@angular/fire/firestore";

@Component({
    selector: 'app-event-card-short',
    templateUrl: './event-card-short.component.html',
    styleUrls: ['./event-card-short.component.css']
})
export class EventCardShortComponent implements OnInit {

  @Input() event: Event;

  @Input() index: number;

  hasPrimaryColorIndex: boolean;

  private static readonly ICON_CLASSES = {
      [EventDate.EVENT]: {
          default: 'fa-calendar-day',
          lastDate: 'fa-flag-checkered',
          firstDate: 'fa-bullhorn'
      },
      [EventDate.INSCRIPTION]: {
          default: 'fa-file-pen',
          lastDate: 'fa-file-circle-check',
          firstDate: 'fa-file-pen'
      }
  }

  constructor(
    private translate: TranslateService,
    private eventService: EventService
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

  private formatConfirmedDate(date: Date): string {
      return date.toLocaleDateString(this.locale(), {day: 'numeric', month: 'long', timeZone: 'UTC'});
  }

  private formatTentativeDate(month: number): string {
      const fakeDate = new Date(new Date().getFullYear(), month);
      return this.capitalizeFirstLetter(fakeDate.toLocaleDateString(this.locale(), {month: 'long', timeZone: 'UTC'})) + ' ' + fakeDate.getFullYear();
  }

  getEventData(): {
      date: string,
      iconClass: string
      } {
      const upcomingDate = this.eventService.getUpcomingEventDate(this.event) || EventDate.EVENT;
      const eventDate = this.event.dates[upcomingDate];
      if (eventDate.status === EventStatus.CONFIRMED) {
          const now = Timestamp.now().toDate();
          if (eventDate.isPeriod) {
              if (eventDate.date < now && now < eventDate.lastDate) {
                  return {
                      date: this.formatConfirmedDate(eventDate.lastDate),
                      iconClass: EventCardShortComponent.ICON_CLASSES[upcomingDate].lastDate
                  }
              }
              return {
                  date: this.formatConfirmedDate(eventDate.date),
                  iconClass: EventCardShortComponent.ICON_CLASSES[upcomingDate].firstDate
              }
          }
          return {
              date: this.formatConfirmedDate(eventDate.date),
              iconClass: EventCardShortComponent.ICON_CLASSES[upcomingDate].default
          }
      } else if (eventDate.status === EventStatus.TENTATIVE) {
          return {
              date: this.formatTentativeDate(eventDate.month),
              iconClass: EventCardShortComponent.ICON_CLASSES[upcomingDate].default
          }
      } else if (eventDate.status === EventStatus.UPCOMING) {
          return {
              date: String(eventDate.year),
              iconClass: EventCardShortComponent.ICON_CLASSES[upcomingDate].default
          }
      }
      return {
          date: this.translate.instant('HOME.EVENTS.STATUS.UNSCHEDULED.TITLE'),
          iconClass: ''
      }
  }

  getEventDate(): string {
      return this.getEventData().date;
  }

  getEventIconClass(): string {
      return this.getEventData().iconClass;
  }
}
