import { Component, Input } from '@angular/core';
import { AppConfigService } from '../../../core/services/configuration/app-config.service';
import {Event, EventDate, EventStatus} from "../../models/event/event";
import {EventService} from "../../../core/services/event/event.service";

@Component({
    selector: 'app-ranking-page-button',
    templateUrl: './ranking-page-button.component.html',
    styleUrls: ['./ranking-page-button.component.css']
})
export class RankingPageButtonComponent {
  @Input() isAsimov: boolean = false;
  @Input() rankingPath: string = '/ieeextreme-ranking'; // Default
  @Input() dates?: Event['dates'];

  constructor(
    private appConfigService: AppConfigService,
    private eventService: EventService
  ) {}

  getAppColors() {
      return this.appConfigService.getAppColors();
  }

  showRankingButton(): boolean {
      return !!this.dates && this.dates?.[EventDate.EVENT].status === EventStatus.CONFIRMED && this.eventService.isEventDateCurrent(this.dates?.[EventDate.EVENT]);
  }

}
