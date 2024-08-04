import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MDBModalRef } from 'angular-bootstrap-md';

export type AlertModalType = "success" | "error" | "warning";

@Component({
    selector: 'app-alert-modal',
    templateUrl: './alert-modal.component.html',
    styleUrls: ['./alert-modal.component.css']
})
export class AlertModalComponent implements OnInit {
    @Input() type: AlertModalType; // Success, error or warning
    @Input() message: string; // Both translate code and plain text work

    icons = {
        "success": "check",
        "error": "exclamation-circle",
        "warning": "exclamation-triangle"
    }

    constructor(public modalRef: MDBModalRef, private translate: TranslateService) {}

    ngOnInit(): void {
        this.translate.get(this.message).subscribe({
            next: (res) => {
                if (res) this.message = res;
            }
        });
    }

}
