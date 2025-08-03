import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Robot } from '../../../../../shared/models/event/asimov/robot'
import { Category } from '../../../../../shared/models/event/asimov/category';

export interface RobotFormDialogData {
    title: string;
    categories: Category[];
}

@Component({
    selector: 'app-robot-form-dialog',
    templateUrl: './robot-form-dialog.component.html',
    styleUrls: ['./robot-form-dialog.component.css']
})
export class RobotFormDialogComponent {
    robotForm: FormGroup;
    teams: string[] = ['Autobots', 'Decepticons'];
    categories: Category[];

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
        this.categories = data.categories;
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
