import {Component, Inject, Input, LOCALE_ID, OnInit} from '@angular/core';
import { EventCardData } from '../../models/event/event-card-data';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-event-card-short',
  templateUrl: './event-card-short.component.html',
  styleUrls: ['./event-card-short.component.css']
})
export class EventCardShortComponent implements OnInit {

  @Input() event: EventCardData;

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
}
