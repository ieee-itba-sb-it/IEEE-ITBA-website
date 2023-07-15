import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Translations
import {TranslateModule, TranslateLoader, MissingTranslationHandler} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { EasingLogic, NgxPageScrollCoreModule } from 'ngx-page-scroll-core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { firebaseConfig } from './secrets';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import {CustomMissingTranslationHandler} from './shared/CustomMissingTranslationHandler';
import { CardsModule } from 'angular-bootstrap-md';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { FlexModule } from '@angular/flex-layout';
import { MatChipsModule } from '@angular/material/chips';
import { SharedModule } from './shared/shared.module';


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

  t = t / (d / 2);
  if (t >= 1) {
    return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
  }

  return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AppRoutingModule,
    NgxPageScrollCoreModule.forRoot({duration: 500, easingLogic: myEasing}),
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      missingTranslationHandler: {provide: MissingTranslationHandler, useClass: CustomMissingTranslationHandler},
      defaultLanguage: 'es'
    }),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    HttpClientModule,
    CardsModule,
    EmojiModule,
    FlexModule,
    MatChipsModule,
    SharedModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

