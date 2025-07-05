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
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatButtonModule} from "@angular/material/button";
import { CategoriesComponent } from './pages/categories/categories.component';
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";


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
        MatSelectModule,
        MatButtonModule,
        MatListModule,
        MatIconModule,
        MatInputModule
    ]
})
export class AsimovAdminModule {}
