import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { RobotManagerComponent } from './pages/robot-manager/robot-manager.component';
import { EncountersComponent } from './pages/encounters/encounters.component';
import {RouterModule, Routes} from "@angular/router";
import {SharedModule} from "../../shared/shared.module";
import {MatTableModule} from "@angular/material/table";
import {CdkScrollable} from "@angular/cdk/overlay";
import { CsvUploadBoxComponent } from './pages/robot-manager/csv-upload-box/csv-upload-box.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {ReactiveFormsModule} from "@angular/forms";


const routes: Routes = [{
    path: '',
    component: LayoutComponent,
    children: [
        { path: '', redirectTo: 'robots', pathMatch: 'full' },
        { path: 'robots', component: RobotManagerComponent },
        { path: 'encounters', component: EncountersComponent },
    ]
}];

export const routing = RouterModule.forChild(routes);

@NgModule({
    declarations: [
        LayoutComponent,
        RobotManagerComponent,
        EncountersComponent,
        CsvUploadBoxComponent,
        RobotManagerComponent,
    ],
    imports: [
        routing,
        CommonModule,
        SharedModule,
        MatTableModule,
        CdkScrollable,
        MatSnackBarModule,
        MatCheckboxModule,
        MatIconModule,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        ReactiveFormsModule,
    ]
})
export class AsimovAdminModule {}
