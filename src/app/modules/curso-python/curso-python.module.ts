import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {CursoPythonComponent} from './pages/curso-python/curso-python.component';
import {SharedModule} from '../../shared/shared.module';
import {MissingTranslationHandler, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../app.module';
import {HttpClient} from '@angular/common/http';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCardModule} from '@angular/material/card';
import {FlexLayoutModule} from '@angular/flex-layout';
import {CustomMissingTranslationHandler} from '../../shared/CustomMissingTranslationHandler';

const routes: Routes = [
  { path: '',  component: CursoPythonComponent }
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
    MatExpansionModule,
    MatCardModule,
    FlexLayoutModule
  ],
  declarations: [CursoPythonComponent],
})
export class CursoPythonModule { }
