import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {MainpageComponent} from './pages/mainpage/mainpage.component';
import {SharedModule} from '../../shared/shared.module';
import {MatCardModule} from '@angular/material/card';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {MissingTranslationHandler, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../app.module';
import {HttpClient} from '@angular/common/http';
import {FlexLayoutModule} from '@angular/flex-layout';
import {SwiperModule} from 'swiper/angular';
import {CustomMissingTranslationHandler} from '../../shared/CustomMissingTranslationHandler';

const routes: Routes = [
  { path: '',  component: MainpageComponent }
];

export const routing = RouterModule.forChild(routes);

@NgModule({
  declarations: [ MainpageComponent ],
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
    }),
    MDBBootstrapModule.forRoot(),
    FlexLayoutModule,
    SwiperModule
  ]
})
export class MainpageModule { }
