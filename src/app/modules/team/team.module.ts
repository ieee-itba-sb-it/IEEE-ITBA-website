import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {TeamComponent} from './pages/team/team.component';
import {SharedModule} from '../../shared/shared.module';
import {MissingTranslationHandler, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {MatTabsModule} from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {CustomMissingTranslationHandler} from '../../shared/CustomMissingTranslationHandler';
import {HttpLoaderFactory} from '../../shared/translation-helpers';

const routes: Routes = [
  { path: '',  component: TeamComponent }
];

export const routing = RouterModule.forChild(routes);

@NgModule({
    declarations: [TeamComponent],
    imports: [
        routing,
        CommonModule,
        SharedModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            },
            missingTranslationHandler: {provide: MissingTranslationHandler, useClass: CustomMissingTranslationHandler},
            extend: true
        }),
        MatTabsModule,
        MatExpansionModule,
        MDBBootstrapModule.forRoot()
    ]
})
export class TeamModule { }
