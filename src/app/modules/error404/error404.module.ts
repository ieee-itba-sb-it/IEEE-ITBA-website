import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Error404Component } from './pages/error404/error404.component';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
import {MissingTranslationHandler, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {CustomMissingTranslationHandler} from '../../shared/CustomMissingTranslationHandler';
import {HttpLoaderFactory} from '../../shared/translation-helpers';

const routes: Routes = [
  { path: '', component: Error404Component}
];

export const routing = RouterModule.forChild(routes);

@NgModule({
  declarations: [Error404Component],
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
    })
  ]
})
export class Error404Module { }
