import { Component } from '@angular/core';
import {MDBModalRef} from 'angular-bootstrap-md';
import {Router} from '@angular/router';

@Component({
  selector: 'app-auth-action-modal',
  templateUrl: './auth-action-modal.component.html',
  styleUrls: ['./auth-action-modal.component.css']
})
export class AuthActionModalComponent {
    constructor(public modalRef: MDBModalRef, public router: Router) {}

    closeModal(link: string) {
        this.router.navigate([link], { queryParams: { redirectTo: this.router.url }}).then(() => this.modalRef.hide());
    }
}
