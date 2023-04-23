import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NavbarComponent} from './components/navbar/navbar.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatGridListModule} from '@angular/material/grid-list';
import {FooterComponent} from './components/footer/footer.component';
import {MissingTranslationHandler, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {HttpLoaderFactory} from '../app.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {MatMenuModule} from '@angular/material/menu';
import {RouterModule, Routes} from '@angular/router';
import {ContactPageComponent} from '../modules/contact/pages/contact/contact-page.component';
import {LoadingSpinnerComponent} from './components/loading-spinner/loading-spinner.component';
import {Error401Component} from './components/error401/error401.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { EventCardComponent } from './components/event-card/event-card.component';
import { NewsCardComponent } from './components/news-card/news-card.component';
import {MatCardModule} from '@angular/material/card';
import { SponsorComponentComponent } from './components/sponsor-component/sponsor-component.component';
import {MatTabsModule} from '@angular/material/tabs';
import {CustomMissingTranslationHandler} from './CustomMissingTranslationHandler';
import {IndividualCardComponent} from './components/individual-card/individual-card.component';
import {TeamCardComponent} from './components/team-card/team-card.component';
import {EventCardShortComponent} from './components/event-card-short/event-card-shortcomponent';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';

// TODO: Modify this, ContactPageComponent does not belong here!
const routes: Routes = [];

export const routing = RouterModule.forChild(routes);

@NgModule({
  declarations: [NavbarComponent, FooterComponent, LoadingSpinnerComponent, Error401Component,
    EventCardComponent, NewsCardComponent, SponsorComponentComponent, IndividualCardComponent, TeamCardComponent, EventCardShortComponent ],
  imports: [
    routing,
    CommonModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      missingTranslationHandler: {provide: MissingTranslationHandler, useClass: CustomMissingTranslationHandler},
      extend: true
    }),
    FlexLayoutModule,
    MDBBootstrapModule.forRoot(),
    MatMenuModule,
    MatButtonToggleModule,
    MatCardModule,
    MatTabsModule,
    MatChipsModule,
    MatIconModule
  ],
  exports: [NavbarComponent, FooterComponent, LoadingSpinnerComponent, Error401Component,
    EventCardComponent, NewsCardComponent, SponsorComponentComponent, IndividualCardComponent, TeamCardComponent, EventCardShortComponent]
})
export class SharedModule { }
