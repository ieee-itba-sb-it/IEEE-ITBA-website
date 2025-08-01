import { NgModule } from '@angular/core';
import { AsyncPipe, CommonModule, NgFor, NgIf } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PredictionComponent } from './pages/prediction/prediction.component';
import {SharedModule} from "../../shared/shared.module";
import {TranslateModule} from "@ngx-translate/core";
import { ResultsComponent } from './pages/results/results.component';
import { TournamentTreeComponent } from '../../shared/components/tournament-tree/tournament-tree.component';
import { MatTabsModule } from '@angular/material/tabs';
import { FilterByCategory } from './pages/results/components/filter-by-category.pipe';
import { CompleteEncounterLevelsPipe } from './pages/results/components/complete-encounter-levels.pipe';

// Tab manager
const routes: Routes = [{
    path: '',
    component: LayoutComponent,
    children: [
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        { path: 'dashboard', component: DashboardComponent },
        { path: 'prediction', component: PredictionComponent },
        { path: 'live', component: ResultsComponent }
    ]
}];

export const routing = RouterModule.forChild(routes);

@NgModule({
    declarations: [
        LayoutComponent,
        DashboardComponent,
        PredictionComponent,
        ResultsComponent,
    ],
    imports: [
        routing,
        CommonModule,
        SharedModule,
        MatTabsModule, NgFor, AsyncPipe, FilterByCategory,
        NgIf,
        CompleteEncounterLevelsPipe,
        TranslateModule
    ]
})
export class AsimovDashboardModule { }
