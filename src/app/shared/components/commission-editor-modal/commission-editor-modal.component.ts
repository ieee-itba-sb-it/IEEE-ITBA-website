import { Component } from '@angular/core';
import { MDBModalRef } from 'angular-bootstrap-md';

@Component({
  selector: 'app-commission-editor-modal',
  templateUrl: './commission-editor-modal.component.html',
  styleUrls: ['./commission-editor-modal.component.css']
})
export class CommissionEditorModalComponent {
  error: string;
  commission: any;

  constructor(public modalRef: MDBModalRef) { }
}
