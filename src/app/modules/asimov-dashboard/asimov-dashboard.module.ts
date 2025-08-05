import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import {SharedModule} from "../../shared/shared.module";
import {PredictionFormComponent} from "./pages/prediction-form/predictionForm.component";
import {TranslateModule} from "@ngx-translate/core";
import { PredictionComponent } from './pages/prediction/prediction.component';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";

// Tab manager
const routes: Routes = [{
    path: '',
    component: LayoutComponent,
    children: [
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        { path: 'dashboard', component: DashboardComponent },
        { path: 'prediction', component: PredictionComponent },
        { path: 'prediction/:categoria', component: PredictionFormComponent },
    ]
}];

export const routing = RouterModule.forChild(routes);

@NgModule({
    declarations: [
        LayoutComponent,
        DashboardComponent,
        PredictionComponent,
    ],
    imports: [
        routing,
        CommonModule,
        SharedModule,
        TranslateModule,
        MatButtonModule,
        MatIconModule
    ]
})
export class AsimovDashboardModule { }
