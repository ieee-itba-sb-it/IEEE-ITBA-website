import { NgModule } from '@angular/core';
import { AsyncPipe, CommonModule, NgFor, NgIf } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import {SharedModule} from "../../shared/shared.module";
import {PredictionFormComponent} from "./pages/prediction-form/predictionForm.component";
import {TranslateModule} from "@ngx-translate/core";
import { MatTabsModule } from '@angular/material/tabs';
import { PredictionComponent } from './pages/prediction/prediction.component';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {ResultsComponent} from "./pages/results/results.component";
import {CompleteEncounterLevelsPipe} from "./pages/results/components/complete-encounter-levels.pipe";
import {FilterByCategory} from "./pages/results/components/filter-by-category.pipe";

// Tab manager
const routes: Routes = [{
    path: '',
    component: LayoutComponent,
    children: [
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        { path: 'dashboard', component: DashboardComponent },
        { path: 'prediction', component: PredictionComponent },
        { path: 'live', component: ResultsComponent },
        { path: 'prediction/:categoria', component: PredictionFormComponent },
    ]
}];

export const routing = RouterModule.forChild(routes);

@NgModule({
    declarations: [
        LayoutComponent,
        DashboardComponent,
        PredictionComponent,
        ResultsComponent
    ],
    imports: [
        routing,
        CommonModule,
        SharedModule,
        MatTabsModule, NgFor, AsyncPipe, FilterByCategory,
        NgIf,
        CompleteEncounterLevelsPipe,
        TranslateModule,
        MatButtonModule,
        MatIconModule
    ]
})
export class AsimovDashboardModule { }
