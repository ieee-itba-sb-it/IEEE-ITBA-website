import {Component, Input, OnInit} from '@angular/core';
import {MDBModalRef, MDBModalService} from "angular-bootstrap-md";
import {EventEditorModalComponent} from "../event-editor-modal/event-editor-modal.component";
import {EventCardData} from "../../models/event/event-card-data";
import {AuthService} from "../../../core/services/authorization/auth.service";
import {BehaviorSubject} from "rxjs";
import {UserService} from "../../../core/services/user/user.service";
import {roles} from "../../models/roles/roles.enum";

@Component({
    selector: 'app-event-editor-button',
    templateUrl: './event-editor-button.component.html',
    styleUrls: ['./event-editor-button.component.css']
})
export class EventEditorButtonComponent implements OnInit {

    modalRef: MDBModalRef | null = null;
    @Input() event: EventCardData;
    isAdmin$ = new BehaviorSubject(false);

    constructor(private modalService: MDBModalService, private authService: AuthService, private userService: UserService) { }

    openModal() {
        if (!this.isAdmin$) {
            return;
        }
        this.modalRef = this.modalService.show(EventEditorModalComponent, {
            data: {
                event: this.event
            },
            class: 'modal-dialog-centered',
        });
    }

    ngOnInit(): void {
        this.setIsAdmin$();
    }

    setIsAdmin$() {
        this.authService.getCurrentUser()
            .subscribe(async (user) => {
                if (!user) {
                    this.isAdmin$.next(false);
                    return;
                }
                const userRole = user.role || await this.userService.getCurrentUserRole(user.email);
                if (userRole === roles.admin) {
                    this.isAdmin$.next(true);
                } else {
                    this.isAdmin$.next(false);
                }
            });
    }
}
