import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EventsComponent} from './pages/events/events.component';
import {SharedModule} from '../../shared/shared.module';
import {RouterModule, Routes} from '@angular/router';
import {MissingTranslationHandler, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {MatCardImage, MatCardModule} from '@angular/material/card';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {CustomMissingTranslationHandler} from '../../shared/CustomMissingTranslationHandler';
import {HttpLoaderFactory} from '../../shared/translation-helpers';

const routes: Routes = [
  { path: '',  component: EventsComponent }
];

export const routing = RouterModule.forChild(routes);

@NgModule({
  declarations: [ EventsComponent ],
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
    MatCardModule,
    MDBBootstrapModule.forRoot()
  ]
})
export class EventsModule { }
