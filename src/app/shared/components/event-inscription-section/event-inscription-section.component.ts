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
    // The user is already enrolled: while the inscription is open, the [enrolledContent] projected by the page
    // is shown instead of the inscription button
    @Input() enrolled: boolean = false;

    constructor(
        private appConfigService: AppConfigService,
        private eventService: EventService,
    ) { }

    getAppColors() {
        return this.appConfigService.getAppColors();
    }

    private isInscriptionOpen(): boolean {
        return this.eventService.isEventDateOpen(this.dates?.[EventDate.INSCRIPTION]);
    }

    showInscriptionButton(): boolean {
        return !this.enrolled && !!this.inscriptionLink && this.isInscriptionOpen();
    }

    showEnrolledConfirmation(): boolean {
        return this.enrolled && this.isInscriptionOpen();
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

    showSection(): boolean {
        return this.showEnrollSection() || this.showEnrolledConfirmation() || this.showExamsButton();
    }

    sectionTitle(): string {
        if (this.showEnrollSection()) return 'HOME.EVENTS.ENROLL.OPEN';
        if (this.showEnrolledConfirmation()) return 'HOME.EVENTS.ENROLL.ENROLLED';
        return 'HOME.EVENTS.EXAMS.OPEN';
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
