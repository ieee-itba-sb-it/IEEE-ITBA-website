import { LOCALE_ID, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Translations
import { TranslateModule, TranslateLoader, MissingTranslationHandler, TranslateService } from '@ngx-translate/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { EasingLogic, NgxPageScrollCoreModule } from 'ngx-page-scroll-core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { firebaseConfig } from './secrets';
import { environment } from '../environments/environment';

import {CustomMissingTranslationHandler} from './shared/CustomMissingTranslationHandler';

import { connectFirestoreEmulator, getFirestore, provideFirestore } from '@angular/fire/firestore';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { connectDatabaseEmulator, getDatabase, provideDatabase } from '@angular/fire/database';

import { CardsModule } from 'angular-bootstrap-md';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { FlexModule } from '@angular/flex-layout';
import { MatChipsModule } from '@angular/material/chips';
import { SharedModule } from './shared/shared.module';
import { HttpLoaderFactory } from './shared/translation-helpers';
import { IMAGE_LOADER, ImageLoaderConfig, NgOptimizedImage } from '@angular/common';
import { connectAuthEmulator } from '@angular/fire/auth';

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
        provideFirebaseApp(() => initializeApp(firebaseConfig)),
        provideFirestore(() => {
            const firestore = getFirestore();
            if (!environment.production) connectFirestoreEmulator(firestore, 'localhost', 8080);
            return firestore;
        }),
        provideAuth(() => {
            const fireauth = getAuth();
            if (!environment.production) connectAuthEmulator(fireauth, 'http://localhost:9099');
            return fireauth;
        }),
        provideDatabase(() => {
            const firedatabase = getDatabase();
            if (!environment.production) connectDatabaseEmulator(firedatabase, 'localhost', 9000)
            return firedatabase;
        }),
        HttpClientModule,
        CardsModule,
        EmojiModule,
        FlexModule,
        MatChipsModule,
        SharedModule,
        NgOptimizedImage
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

