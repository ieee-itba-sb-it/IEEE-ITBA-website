import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { IEEEuser } from '../../models/ieee-user/ieee-user';
import { AdminService } from 'src/app/core/services/admin/admin.service';
import { MDBModalRef } from 'angular-bootstrap-md';
import { roles } from '../../models/roles/roles';
import { MatChipListboxChange } from '@angular/material/chips';

@Component({
    selector: 'app-user-editor-modal',
    templateUrl: './user-editor-modal.component.html',
    styleUrls: ['./user-editor-modal.component.css']
})
export class UserEditorModalComponent implements OnInit{

    @Input() user: IEEEuser;
    @Output() update: EventEmitter<IEEEuser> = new EventEmitter();
    updatedUser: IEEEuser;
    roles = roles;

    error: string;

    constructor(private adminService: AdminService, public modalRef: MDBModalRef) { }

    ngOnInit(): void {
        this.updatedUser = { ...this.user };
    }

    changeRole(e: MatChipListboxChange) {
        this.updatedUser.roles = e.value;
    }

    updateUser() {
        if (JSON.stringify(this.updatedUser) == JSON.stringify(this.user)) return this.error = "ADMIN.USERTAB.ERRORS.NO_CHANGES";
        if (this.updatedUser.email != this.user.email) return this.error = "ADMIN.USERTAB.ERRORS.CANNOT_CHANGE_EMAIL";
        this.adminService.updateUser(this.updatedUser, this.updatedUser.roles != this.user.roles).subscribe(res => {
            delete this.error;
            this.update.emit(this.updatedUser);
            this.modalRef.hide();
        });

    }
}
