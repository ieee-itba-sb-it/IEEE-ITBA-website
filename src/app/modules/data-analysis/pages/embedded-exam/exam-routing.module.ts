import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExamComponent } from './exam/exam.component';
import {ExamListComponent} from "./exam-list/exam-list.component";

const routes: Routes = [
    { path: '', component: ExamListComponent },
    {path: 'day/:id', component: ExamComponent, data: {hideChrome:true}}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ExamRoutingModule { }
