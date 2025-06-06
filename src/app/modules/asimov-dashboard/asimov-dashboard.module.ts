import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import { LayoutComponent } from './layout/layout.component';
import { InscriptionComponent } from './pages/inscription/inscription.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PredictionComponent } from './pages/prediction/prediction.component';

// Tab manager
const routes: Routes = [{
  path: '',
  component: LayoutComponent,
  children: [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'inscription', component: InscriptionComponent },
    { path: 'prediction', component: PredictionComponent },
  ]
}];

export const routing = RouterModule.forChild(routes);

@NgModule({
  declarations: [
    LayoutComponent,
    InscriptionComponent,
    DashboardComponent,
    PredictionComponent
  ],
  imports: [
    routing,
    CommonModule
  ]
})
export class AsimovDashboardModule { }
