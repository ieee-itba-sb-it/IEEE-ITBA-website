import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypescriptComponent } from './pages/typescript.component';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
import {MissingTranslationHandler, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../app.module';
import {HttpClient} from '@angular/common/http';
import {CustomMissingTranslationHandler} from '../../shared/CustomMissingTranslationHandler';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';

const routes: Routes = [
  {path: '', component: TypescriptComponent}
];

export const routing = RouterModule.forChild(routes);


@NgModule({
  declarations: [TypescriptComponent],
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
    },
    ),
    MatExpansionModule,
    MatCardModule,
    MatButtonModule
  ]
})
export class TypescriptModule { }
