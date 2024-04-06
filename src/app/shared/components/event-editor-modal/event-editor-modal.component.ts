import {Component, Input} from '@angular/core';
import {EventCardData} from "../../models/event/event-card-data";
import {EventService} from "../../../core/services/event/event.service";
import {MDBModalRef} from "angular-bootstrap-md";

@Component({
    selector: 'app-event-editor-modal',
    templateUrl: './event-editor-modal.component.html',
    styleUrls: ['./event-editor-modal.component.css']
})
export class EventEditorModalComponent {

    @Input() event: EventCardData;
    errorI18n: string = null;

    constructor(private eventService: EventService, public modalRef: MDBModalRef) { }

    dateChanged(isoDate: string) {
        this.event.dates[0].date = new Date(isoDate);
    }

    updateEvent() {
        this.eventService.updateEvent(this.event)
            .subscribe((updated) => {
                if (updated) {
                    this.modalRef.hide();
                    this.errorI18n = null;
                } else {
                    this.errorI18n = 'HOME.EVENTS.EDIT.ERROR.SAVE';
                }
            })
    }

}
