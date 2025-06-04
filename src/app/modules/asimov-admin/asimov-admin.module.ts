import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { RobotManagerComponent } from './pages/robot-manager/robot-manager.component';
import { EncountersComponent } from './pages/encounters/encounters.component';
import {RouterModule, Routes} from "@angular/router";

// Tab manager
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
    EncountersComponent
  ],
  imports: [
    routing,
    CommonModule
  ]
})
export class AsimovAdminModule {}
