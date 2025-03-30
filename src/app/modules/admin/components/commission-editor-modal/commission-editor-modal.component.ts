import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { MDBModalRef } from 'angular-bootstrap-md';
import {Commission} from "../../../../shared/models/commission";
import {TeamService} from "../../../../core/services/team/team.service";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
    selector: 'app-commission-editor-modal',
    templateUrl: './commission-editor-modal.component.html',
    styleUrls: ['./commission-editor-modal.component.css']
})
export class CommissionEditorModalComponent {
    @Input() order: number;
    @Output() update: EventEmitter<Commission> = new EventEmitter();

    error: string;
    commission: Commission;
    commissionForm: FormGroup;
    loading:boolean = false;

    constructor(private teamService: TeamService, public modalRef: MDBModalRef) {
        this.commissionForm = new FormGroup({
            id: new FormControl('', Validators.required),
            title: new FormGroup({
                es: new FormControl('', Validators.required),
                en: new FormControl('', Validators.required)
            }),
            main: new FormControl(false, Validators.required)
        });
    }

    //Chequear tema Validators

    addCommission() {
        if(this.loading) return;
        if(this.commissionForm.invalid) {
            this.error = "Error en el cargado del formulario.";
            return;
        }
        let commission : Commission = this.commissionForm.value as Commission;
        commission.order = this.order;
        commission.main = !commission.main;
        commission.positions = [];
        this.teamService.setCommission(commission).subscribe(res => {
            this.update.emit(commission);
            this.modalRef.hide();
        });
        this.loading = true;
    }
}
