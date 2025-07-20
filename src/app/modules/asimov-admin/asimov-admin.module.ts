import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { RobotManagerComponent } from './pages/robot-manager/robot-manager.component';
import { EncountersComponent } from './pages/encounters/encounters.component';
import {RouterModule, Routes} from "@angular/router";
import {FormsModule} from "@angular/forms";
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
import { CategoriesComponent } from './pages/categories/categories.component';
import {MatListModule} from "@angular/material/list";
import {MatCardModule} from "@angular/material/card";
import {MatTabsModule} from "@angular/material/tabs";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatChipsModule} from "@angular/material/chips";


// Tab manager
const routes: Routes = [{
    path: '',
    component: LayoutComponent,
    children: [
        { path: '', redirectTo: 'robots', pathMatch: 'full' },
        { path: 'robots', component: RobotManagerComponent },
        { path: 'encounters', component: EncountersComponent },
        { path: 'categories', component: CategoriesComponent },
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
        CategoriesComponent
    ],
    imports: [
        routing,
        CommonModule,
        FormsModule,
        MatFormFieldModule,
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
        MatSnackBarModule,
        MatSelectModule,
        MatButtonModule,
        MatListModule,
        MatIconModule,
        MatInputModule,
        MatCardModule,
        MatTabsModule,
        MatTooltipModule,
        MatChipsModule
    ]
})
export class AsimovAdminModule {}
