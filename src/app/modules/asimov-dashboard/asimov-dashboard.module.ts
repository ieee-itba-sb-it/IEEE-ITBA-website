import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PredictionComponent } from './pages/prediction/prediction.component';
import {SharedModule} from "../../shared/shared.module";
import {TranslateModule} from "@ngx-translate/core";

// Tab manager
const routes: Routes = [{
  path: '',
  component: LayoutComponent,
  children: [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'prediction', component: PredictionComponent },
  ]
}];

export const routing = RouterModule.forChild(routes);

@NgModule({
  declarations: [
    LayoutComponent,
    DashboardComponent,
    PredictionComponent
  ],
    imports: [
        routing,
        CommonModule,
        SharedModule,
        TranslateModule
    ]
})
export class AsimovDashboardModule { }
