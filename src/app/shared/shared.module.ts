import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NavbarComponent} from './components/navbar/navbar.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatGridListModule} from '@angular/material/grid-list';
import {FooterComponent} from './components/footer/footer.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {HttpLoaderFactory} from '../app.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {MatMenuModule} from '@angular/material/menu';
import {RouterModule, Routes} from '@angular/router';
import {ContactPageComponent} from '../modules/contact/pages/contact/contact-page.component';
import {LoadingSpinnerComponent} from './components/loading-spinner/loading-spinner.component';
import {Error401Component} from './components/error401/error401.component';

// TODO: Modify this, ContactPageComponent does not belong here!
const routes: Routes = [];

export const routing = RouterModule.forChild(routes);

@NgModule({
  declarations: [NavbarComponent, FooterComponent, LoadingSpinnerComponent, Error401Component],
  imports: [
    routing,
    CommonModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    FlexLayoutModule,
    MDBBootstrapModule.forRoot(),
    MatMenuModule
  ],
  exports: [NavbarComponent, FooterComponent, LoadingSpinnerComponent, Error401Component]
})
export class SharedModule { }
