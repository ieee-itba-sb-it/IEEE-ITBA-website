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
import { environment } from '../environments/environment';

import {CustomMissingTranslationHandler} from './shared/CustomMissingTranslationHandler';
import {AngularFireModule} from '@angular/fire/compat';
import {AngularFirestoreModule} from '@angular/fire/compat/firestore';
import {AngularFireAuthModule} from '@angular/fire/compat/auth';

import { USE_EMULATOR as USE_AUTH_EMULATOR } from '@angular/fire/compat/auth';
import { USE_EMULATOR as USE_DATABASE_EMULATOR } from '@angular/fire/compat/database';
import { USE_EMULATOR as USE_FIRESTORE_EMULATOR } from '@angular/fire/compat/firestore';

import { CardsModule } from 'angular-bootstrap-md';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { FlexModule } from '@angular/flex-layout';
import { MatChipsModule } from '@angular/material/chips';
import { SharedModule } from './shared/shared.module';
import { HttpLoaderFactory } from './shared/translation-helpers';
import { IMAGE_LOADER, ImageLoaderConfig, NgOptimizedImage } from '@angular/common';

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
        NgOptimizedImage
    ],
    providers: [
        { provide: USE_AUTH_EMULATOR, useValue: !environment.production ? ['http://localhost:9099'] : undefined },
        { provide: USE_DATABASE_EMULATOR, useValue: !environment.production ? ['http://localhost:9000'] : undefined },
        { provide: USE_FIRESTORE_EMULATOR, useValue: !environment.production ? ['localhost', 8080] : undefined },
        {
            provide: IMAGE_LOADER, useValue: ({ src, width }: ImageLoaderConfig) => {
                return `https://imagecdn.app/v2/image/${encodeURIComponent(src)}?format=webp&width=${encodeURIComponent(width)}`;
            }
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

