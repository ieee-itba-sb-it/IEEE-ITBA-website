import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TranslateLoader, TranslateModule, MissingTranslationHandler } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { CustomMissingTranslationHandler } from '../../shared/CustomMissingTranslationHandler';
import { HttpLoaderFactory } from '../../shared/translation-helpers';
import { SharedModule } from '../../shared/shared.module';
import { RankingComponent } from './pages/ranking/ranking.component';
import { IeeextremeService } from '../../core/services/ieeextreme/ieeextreme.service';

const routes: Routes = [
    { path: '', component: RankingComponent }
];

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(routes),
        TranslateModule.forChild({
            loader: { provide: TranslateLoader, useFactory: HttpLoaderFactory, deps: [HttpClient] },
            missingTranslationHandler: { provide: MissingTranslationHandler, useClass: CustomMissingTranslationHandler },
            extend: true
        })
    ],
    declarations: [RankingComponent]
})
export class IeeextremeRankingModule {}
