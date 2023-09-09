import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {IeeextremeComponent} from './pages/ieeextreme/ieeextreme.component';
import {SharedModule} from '../../shared/shared.module';
import {MissingTranslationHandler, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {CustomMissingTranslationHandler} from '../../shared/CustomMissingTranslationHandler';
import {HttpLoaderFactory} from '../../shared/translation-helpers';
import {MatCardModule} from '@angular/material/card';

const routes: Routes = [
  { path: '',  component: IeeextremeComponent }
];

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
        deps: [HttpClient]
      },
      missingTranslationHandler: {provide: MissingTranslationHandler, useClass: CustomMissingTranslationHandler},
      extend: true
    })
  ],
  declarations: [ IeeextremeComponent ]
})
export class IeeextremeModule { }
