import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatCardModule} from "@angular/material/card";
import {RouterModule, Routes} from "@angular/router";
import {TeamRequestComponent} from "./pages/team-request.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatOptionModule} from "@angular/material/core";

const routes: Routes = [
    { path: '',  component: TeamRequestComponent}
];

export const routing = RouterModule.forChild(routes);

@NgModule({
    declarations: [],
    imports: [
        routing,
        MatCardModule,
        MatFormFieldModule,
        MatSelectModule,
        MatOptionModule,
        CommonModule
    ]
})
export class TeamRequestModule { }
