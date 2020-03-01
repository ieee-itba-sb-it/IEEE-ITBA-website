import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

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

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    AboutIEEEItbaComponent,
    IeeeEventosComponent,
    EquipoComponent,
    ItbaIeeeMarcaComponent,
    CargoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FlexLayoutModule,
    MDBBootstrapModule.forRoot(),
    NgxPageScrollCoreModule.forRoot({duration: 500, easingLogic: myEasing})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
