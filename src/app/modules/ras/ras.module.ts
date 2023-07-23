import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RasComponent } from './pages/ras/ras.component';
import { SharedModule } from '../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import {MissingTranslationHandler, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import {CustomMissingTranslationHandler} from '../../shared/CustomMissingTranslationHandler';
import {HttpLoaderFactory} from '../../shared/translation-helpers';

const routes: Routes = [{ path: '', component: RasComponent }];

export const routing = RouterModule.forChild(routes);

@NgModule({
    imports: [
        routing,
        CommonModule,
        SharedModule,
        MatCardModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
            missingTranslationHandler: {provide: MissingTranslationHandler, useClass: CustomMissingTranslationHandler},
            extend: true
        }),
        MDBBootstrapModule.forRoot(),
        FlexLayoutModule
    ],
  declarations: [RasComponent],
})
export class RasModule {}
