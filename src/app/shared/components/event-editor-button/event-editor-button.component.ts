import {Component, Input} from '@angular/core';
import {MDBModalRef, MDBModalService} from "angular-bootstrap-md";
import {EventEditorModalComponent} from "../event-editor-modal/event-editor-modal.component";
import {EventCardData} from "../../models/event/event-card-data";

@Component({
    selector: 'app-event-editor-button',
    templateUrl: './event-editor-button.component.html',
    styleUrls: ['./event-editor-button.component.css']
})
export class EventEditorButtonComponent {

    modalRef: MDBModalRef | null = null;
    @Input() event: EventCardData;

    constructor(private modalService: MDBModalService) { }

    openModal() {
        this.modalRef = this.modalService.show(EventEditorModalComponent, {
            data: {
                event: this.event
            },
            class: 'modal-dialog-centered',
        });
    }
}
