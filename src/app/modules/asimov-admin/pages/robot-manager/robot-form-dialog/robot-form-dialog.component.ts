import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Robot } from '../../../../../shared/models/event/asimov/robot'
import { Category } from '../../../../../shared/models/event/asimov/category';

export interface RobotFormDialogData {
    title: string;
}

@Component({
    selector: 'app-robot-form-dialog',
    templateUrl: './robot-form-dialog.component.html',
    styleUrls: ['./robot-form-dialog.component.css']
})
export class RobotFormDialogComponent {
    robotForm: FormGroup;
    categories: Category[] = [
        { id: 'C001', name: 'Líder' },
        { id: 'C002', name: 'Explorador' },
        { id: 'C003', name: 'Comandante Aéreo' },
        { id: 'C004', name: 'Guerrero' },
        { id: 'C005', name: 'Comunicador' },
        { id: 'C006', name: 'Científico' },
        { id: 'C007', name: 'Médico' },
        { id: 'C008', name: 'Combinador' },
        { id: 'C009', name: 'Estratega' },
        { id: 'C010', name: 'Dinobot' },
        { id: 'C011', name: 'Joven Guerrero' },
        { id: 'C012', name: 'Mensajero Rápido' },
    ];

    teams: string[] = ['Autobots', 'Decepticons'];

    constructor(
        public dialogRef: MatDialogRef<RobotFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: RobotFormDialogData,
        private fb: FormBuilder
    ) {
        this.robotForm = this.fb.group({
            id: ['', Validators.required],
            name: ['', Validators.required],
            photo: [''], // Optional
            category: [null, Validators.required],
            team: ['', Validators.required]
        });
    }

    onCancel(): void {
        this.dialogRef.close(null);
    }

    onSave(): void {
        if (this.robotForm.valid) {
            this.dialogRef.close(this.robotForm.value);
        }
    }
}
