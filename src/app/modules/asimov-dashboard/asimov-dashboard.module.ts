import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import {SharedModule} from "../../shared/shared.module";
import {PredictionFormComponent} from "./pages/prediction-form/predictionForm.component";

// Tab manager
const routes: Routes = [{
    path: '',
    component: LayoutComponent,
    children: [
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        { path: 'dashboard', component: DashboardComponent },
        { path: 'prediction/:categoria', component: PredictionFormComponent },
    ]
}];

export const routing = RouterModule.forChild(routes);

@NgModule({
    declarations: [
        LayoutComponent,
        DashboardComponent,
    ],
    imports: [
        routing,
        CommonModule,
        SharedModule
    ]
})
export class AsimovDashboardModule { }
