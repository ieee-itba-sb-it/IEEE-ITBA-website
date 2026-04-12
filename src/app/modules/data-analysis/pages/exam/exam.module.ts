import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamComponent } from './exam.component';
import {ReactiveFormsModule} from "@angular/forms";
import {ExamRoutingModule} from "./exam-routing.module";
import {MatCardModule} from "@angular/material/card";
import {MatRadioModule} from "@angular/material/radio";
@NgModule({
    declarations: [
        ExamComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ExamRoutingModule,
        MatCardModule,
        MatRadioModule
    ]
})
export class ExamModule {}
