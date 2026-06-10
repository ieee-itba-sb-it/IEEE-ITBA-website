import {Component, Input} from '@angular/core';
import {Event, EventDate, EventStatus} from "../../models/event/event";
import {AppConfigService} from "../../../core/services/configuration/app-config.service";
import {EventService} from "../../../core/services/event/event.service";

@Component({
  selector: 'app-event-inscription-section',
  templateUrl: './event-inscription-section.component.html',
  styleUrls: ['./event-inscription-section.component.css']
})
export class EventInscriptionSectionComponent {

    @Input() inscriptionLink?: Event['inscriptionLink'];
    @Input() dates?: Event['dates'];
    @Input() isAsimov: boolean = false;
    @Input() spectatorInscriptionEnabled?: Event['spectatorInscriptionEnabled'];
    @Input() spectatorInscriptionLink?: Event['spectatorInscriptionLink'];

    constructor(
        private appConfigService: AppConfigService,
        private eventService: EventService,
    ) { }

    getAppColors() {
        return this.appConfigService.getAppColors();
    }

    showInscriptionButton(): boolean {
        return !!this.inscriptionLink && !!this.dates && this.dates?.[EventDate.INSCRIPTION].status === EventStatus.CONFIRMED &&
            this.eventService.isEventDateCurrent(this.dates?.[EventDate.INSCRIPTION]);
    }

    showSpectatorInscriptionButton(): boolean {
        console.log(this)
        return !!this.spectatorInscriptionEnabled
            && !!this.spectatorInscriptionLink
            && !!this.dates
            && !!this.dates[EventDate.SPECTATOR_INSCRIPTION]
            && this.dates[EventDate.SPECTATOR_INSCRIPTION].status === EventStatus.CONFIRMED
            && this.eventService.isEventDateCurrent(this.dates[EventDate.SPECTATOR_INSCRIPTION]);
    }

    hasSpectatorInscription(): boolean {
        return !!this.spectatorInscriptionEnabled;
    }

    onInscriptionClick() {
        if (this.inscriptionLink) {
            window.open(this.inscriptionLink, '_blank');
        }
    }

    onSpectatorInscriptionClick() {
        if (this.spectatorInscriptionLink) {
            window.open(this.spectatorInscriptionLink, '_blank');
        }
    }
}
