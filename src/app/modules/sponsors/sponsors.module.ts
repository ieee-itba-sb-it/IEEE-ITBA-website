import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {SponsorsComponent} from './pages/sponsors/sponsors.component';
import {SharedModule} from '../../shared/shared.module';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import {MissingTranslationHandler, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../app.module';
import {HttpClient} from '@angular/common/http';
import {CustomMissingTranslationHandler} from '../../shared/CustomMissingTranslationHandler';

const routes: Routes = [
  { path: '',  component: SponsorsComponent}
];

export const routing = RouterModule.forChild(routes);

@NgModule({
  declarations: [ SponsorsComponent ],
  imports: [
    routing,
    CommonModule,
    SharedModule,
    MatTabsModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      missingTranslationHandler: {provide: MissingTranslationHandler, useClass: CustomMissingTranslationHandler},
      extend: true
    }),
  ]
})
export class SponsorsModule { }
