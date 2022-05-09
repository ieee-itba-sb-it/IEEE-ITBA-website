import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from './../environments/environment';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import {EasingLogic, NgxPageScrollCoreModule} from 'ngx-page-scroll-core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire/compat';

import { USE_EMULATOR as USE_AUTH_EMULATOR } from '@angular/fire/compat/auth';
import { USE_EMULATOR as USE_DATABASE_EMULATOR } from '@angular/fire/compat/database';
import { USE_EMULATOR as USE_FIRESTORE_EMULATOR } from '@angular/fire/compat/firestore';


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export let myEasing: EasingLogic = (t: number, b: number, c: number, d: number): number => {
  // easeInOutExpo easing
  if (t === 0) {
    return b;
  }
  if (t === d) {
    return b + c;
  }
  if ((t /= d / 2) < 1) {
    return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
  }

  return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
};

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AppRoutingModule,
    NgxPageScrollCoreModule.forRoot({ duration: 500, easingLogic: myEasing }),
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    HttpClientModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    AngularFireModule.initializeApp(environment.firebase),
  ],
  exports: [],
  providers: [
    { provide: USE_AUTH_EMULATOR, useValue: environment.emulator ? ['http://localhost:9099'] : undefined },
    { provide: USE_FIRESTORE_EMULATOR, useValue: environment.emulator ? ['http://localhost:8080'] : undefined },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

