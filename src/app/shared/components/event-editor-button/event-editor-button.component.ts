import {Component, Input, OnInit} from '@angular/core';
import {MDBModalRef, MDBModalService} from "angular-bootstrap-md";
import {EventEditorModalComponent} from "../event-editor-modal/event-editor-modal.component";
import {EventCardData} from "../../models/event/event-card-data";
import {AuthService} from "../../../core/services/authorization/auth.service";
import {BehaviorSubject, map} from "rxjs";
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
    @Input() event: EventCardData;

    isAdmin$ = this.authService.getCurrentUser().pipe(map((user) => {
        return !!user && user.role === roles.admin;
    }));


    openModal() {
        this.modalRef = this.modalService.show(EventEditorModalComponent, {
            data: {
                event: this.event
            },
            class: 'modal-dialog-centered',
        });
    }
}
