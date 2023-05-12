import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WieComponent } from './pages/wie.component';
import { RouterModule } from '@angular/router';
import { MissingTranslationHandler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/app.module';
import { HttpClient } from '@angular/common/http';
import { CustomMissingTranslationHandler } from 'src/app/shared/CustomMissingTranslationHandler';

const routes = [
  { path: '', component: WieComponent }
];

export const routing = RouterModule.forChild(routes)

@NgModule({
  declarations: [WieComponent],
  imports: [
    routing,
    CommonModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      missingTranslationHandler: { provide: MissingTranslationHandler, useClass: CustomMissingTranslationHandler },
      extend: true
    }),
  ]
})
export class WieModule { }
