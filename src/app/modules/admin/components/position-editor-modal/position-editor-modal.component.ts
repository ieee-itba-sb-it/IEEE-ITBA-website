import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MDBModalRef } from 'angular-bootstrap-md';
import { TeamService } from 'src/app/core/services/team/team.service';
import { Commission, Position } from 'src/app/shared/models/commission';

@Component({
  selector: 'app-position-editor-modal',
  templateUrl: './position-editor-modal.component.html',
  styleUrls: ['./position-editor-modal.component.css']
})
export class PositionEditorModalComponent implements OnInit {
    @Input() commission: Commission;
    @Input() positionIdx: number;
    @Output() update: EventEmitter<Position> = new EventEmitter();

    error: string;

    positionForm: FormGroup;

    constructor(private teamService: TeamService, public modalRef: MDBModalRef) {
        this.positionForm = new FormGroup({
            id: new FormControl('', Validators.required),
            title: new FormGroup({
                en: new FormControl('', Validators.required),
                es: new FormControl('', Validators.required)
            })
        });
    }

    ngOnInit() {
        if(this.positionIdx != null) {
            this.positionForm.patchValue(this.commission.positions[this.positionIdx]);
        }
    }

    deletePosition() {
        if (this.positionIdx == undefined) return;
        this.commission.positions.splice(this.positionIdx, 1);
        this.commission.positions.forEach((position, index) => {
            position.order = index;
        });
        this.teamService.setCommission(this.commission).subscribe(res => {
            this.update.emit(this.commission.positions[this.positionIdx]);
            this.modalRef.hide();
        });
    }

    addPosition() {
        if(this.positionForm.invalid) {
            this.error = "Error en el cargado del formulario.";
            return;
        }
        let position : Position = this.positionForm.value as Position;
        let index: number = this.positionIdx == undefined ? this.commission.positions.length : this.positionIdx;
        position.order = index;
        this.commission.positions[index] = position;
        this.commission.positions.sort((a, b) => a.order - b.order);
        this.teamService.setCommission(this.commission).subscribe(res => {
            this.update.emit(this.commission);
            this.modalRef.hide();
        });
    }

    hasChanged() {
        if (this.positionIdx == undefined) return JSON.stringify(this.positionForm.value) != "{}";
        let position = this.commission.positions[this.positionIdx];
        delete position.order;
        return JSON.stringify(position) != JSON.stringify(this.positionForm.value);
    }

    editMode() {
        return this.positionIdx != undefined;
    }
}
