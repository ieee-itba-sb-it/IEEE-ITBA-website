import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import { BitcupComponent } from './pages/bitcup/bitcup.component';
import {RouterModule, Routes} from '@angular/router';
import {MissingTranslationHandler, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../app.module';
import {HttpClient} from '@angular/common/http';
import {CustomMissingTranslationHandler} from '../../shared/CustomMissingTranslationHandler';

const routes: Routes = [
  { path: '',  component: BitcupComponent }
];

export const routing = RouterModule.forChild(routes);

@NgModule({
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
  ],
  declarations: [BitcupComponent]
})
export class BitcupModule { }
