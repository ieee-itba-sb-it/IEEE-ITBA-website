import {Component, Input} from '@angular/core';
import {Event, EventDate} from "../../models/event/event";
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
    @Input() examStartDate?: Event['examStartDate'];
    @Input() examsRoute?: string;

    constructor(
        private appConfigService: AppConfigService,
        private eventService: EventService,
    ) { }

    getAppColors() {
        return this.appConfigService.getAppColors();
    }

    showInscriptionButton(): boolean {
        return !!this.inscriptionLink && this.eventService.isEventDateOpen(this.dates?.[EventDate.INSCRIPTION]);
    }

    showSpectatorInscriptionButton(): boolean {
        return !!this.spectatorInscriptionEnabled
            && !!this.spectatorInscriptionLink
            && this.eventService.isEventDateOpen(this.dates?.[EventDate.SPECTATOR_INSCRIPTION]);
    }

    showExamsButton(): boolean {
        if (!this.examsRoute || !this.examStartDate) return false;
        const start = this.eventService.normalizeDate(this.examStartDate);
        const today = this.eventService.normalizeDate(new Date());
        return start <= today;
    }

    showEnrollSection(): boolean {
        return this.showInscriptionButton() || this.showSpectatorInscriptionButton();
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
