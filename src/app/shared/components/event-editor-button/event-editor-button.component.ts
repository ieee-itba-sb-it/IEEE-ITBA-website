import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MDBModalRef, MDBModalService} from "angular-bootstrap-md";
import {EventEditorModalComponent} from "../event-editor-modal/event-editor-modal.component";
import {Event} from "../../models/event/event";
import {AuthService} from "../../../core/services/authorization/auth.service";
import {map} from "rxjs";
import {UserService} from "../../../core/services/user/user.service";
import {roles} from "../../models/roles/roles.enum";

@Component({
    selector: 'app-event-editor-button',
    templateUrl: './event-editor-button.component.html',
    styleUrls: ['./event-editor-button.component.css']
})
export class EventEditorButtonComponent {
    constructor(private modalService: MDBModalService, private authService: AuthService, private userService: UserService) { }

    modalRef: MDBModalRef | null = null;
    @Input() event: Event;
    @Output() updateEmitter: EventEmitter<Event> = new EventEmitter();

    isAdmin$ = this.authService.getCurrentUser().pipe(map((user) => {
        return !!user && user.role === roles.admin;
    }));


    openModal() {
        this.modalRef = this.modalService.show(EventEditorModalComponent, {
            data: {
                event: this.event,
            },
            class: 'modal-dialog-centered modal-lg',
            animated: false
        });
        this.modalRef.content.updateEmitter.subscribe((event: Event) => {
            this.updateEmitter.emit(event);
        });
    }
}
