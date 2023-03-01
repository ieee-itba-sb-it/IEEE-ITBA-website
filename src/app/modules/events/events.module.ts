import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EventsComponent} from './pages/events/events.component';
import {SharedModule} from '../../shared/shared.module';
import {RouterModule, Routes} from '@angular/router';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../app.module';
import {HttpClient} from '@angular/common/http';
import {MatCardImage, MatCardModule} from '@angular/material/card';
import {MDBBootstrapModule} from 'angular-bootstrap-md';

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
      extend: true
    }),
    MatCardModule,
    MDBBootstrapModule.forRoot()
  ]
})
export class EventsModule { }
