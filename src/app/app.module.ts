import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';

import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from './../environments/environment'

//Translations
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { NavbarComponent } from './navbar/navbar.component';
import { AboutIEEEItbaComponent } from './about-ieeeitba/about-ieeeitba.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { IeeeEventosComponent } from './ieee-eventos/ieee-eventos.component';
import { EquipoComponent } from './equipo/equipo.component';
import { ItbaIeeeMarcaComponent } from './itba-ieee-marca/itba-ieee-marca.component';
import { CargoComponent } from './cargo/cargo.component';
import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';
import { myEasing } from './easing';
import { SponsorsComponent } from './sponsors/sponsors.component';
import { IniciativasComponent } from './iniciativas/iniciativas.component';
import { IeeextremeComponent } from './ieeextreme/ieeextreme.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { ContactoComponent } from './contacto/contacto.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarIeeextremeComponent } from './navbar-ieeextreme/navbar-ieeextreme.component';
import { NuevoComponentComponent } from './nuevo-component/nuevo-component.component';
import { BlogComponent } from './blog/blog.component';
import { BlogContentComponent } from './blog-content/blog-content.component';
import { BlogTitleComponent } from './blog-title/blog-title.component';
import { CursoPythonComponent } from './curso-python/curso-python.component';
import { MainpageComponent } from './mainpage/mainpage.component';
import { NewnavbarComponent } from './newnavbar/newnavbar.component';
import { FooterComponent } from './footer/footer.component';
import { TeamComponent } from './team/team.component';
import { config } from 'rxjs';
import { NewieeextremeComponent } from './newieeextreme/newieeextreme.component';
import { NewnavbarIeextremeComponent } from './newnavbar-ieextreme/newnavbar-ieextreme.component';

import { firebaseConfig } from './secrets';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { BlogEntryComponent } from './blog-entry/blog-entry.component';
import { IeeeMeetupComponent } from './ieee-meetup/ieee-meetup.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    AboutIEEEItbaComponent,
    IeeeEventosComponent,
    EquipoComponent,
    ItbaIeeeMarcaComponent,
    CargoComponent,
    SponsorsComponent,
    IniciativasComponent,
    IeeextremeComponent,
    MainMenuComponent,
    ContactoComponent,
    NavbarIeeextremeComponent,
    NuevoComponentComponent,
    BlogComponent,
    BlogContentComponent,
    BlogTitleComponent,
    CursoPythonComponent,
    MainpageComponent,
    NewnavbarComponent,
    FooterComponent,
    TeamComponent,
    NewnavbarIeextremeComponent,
    NewieeextremeComponent,
    BlogEntryComponent,
    IeeeMeetupComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FlexLayoutModule,
    MDBBootstrapModule.forRoot(),
    NgxPageScrollCoreModule.forRoot({duration: 500, easingLogic: myEasing}),
    BrowserAnimationsModule,
    MatTabsModule,
    MatExpansionModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    HttpClientModule
    // AngularFireModule.initializeApp(environment.firebase),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
