import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamComponent } from './exam/exam.component';
import { ExamListComponent } from './exam-list/exam-list.component';
import {ReactiveFormsModule} from "@angular/forms";
import {ExamRoutingModule} from "./exam-routing.module";
import {MatCardModule} from "@angular/material/card";
import {MatRadioModule} from "@angular/material/radio";
import {TranslateModule} from "@ngx-translate/core";
@NgModule({
    declarations: [
        ExamComponent,
        ExamListComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ExamRoutingModule,
        MatCardModule,
        MatRadioModule,
        TranslateModule
    ]
})
export class ExamModule {}
