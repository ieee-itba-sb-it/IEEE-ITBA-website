import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {NoticiasComponent} from './pages/noticias/noticias.component';
import {NoticiaComponent} from './pages/noticia/noticia.component';
import {SharedModule} from '../../shared/shared.module';
import {MissingTranslationHandler, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatCardModule} from '@angular/material/card';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {MatChipsModule} from '@angular/material/chips';
import {EmojiModule} from '@ctrl/ngx-emoji-mart/ngx-emoji';
import {CookieService} from 'ngx-cookie-service';
import {MatGridListModule} from '@angular/material/grid-list';
import {CustomMissingTranslationHandler} from '../../shared/CustomMissingTranslationHandler';
import {HttpLoaderFactory} from '../../shared/translation-helpers';
import {NgxSkeletonLoaderModule} from 'ngx-skeleton-loader';
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";

const routes: Routes = [
    { path: '',  component: NoticiasComponent },
    { path: ':id', component: NoticiaComponent }
];

export const routing = RouterModule.forChild(routes);

@NgModule({
    declarations: [ NoticiaComponent, NoticiasComponent ],
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
            missingTranslationHandler: {provide: MissingTranslationHandler, useClass: CustomMissingTranslationHandler},
            extend: true
        }),
        FlexLayoutModule,
        MatCardModule,
        MDBBootstrapModule.forRoot(),
        MatChipsModule,
        EmojiModule,
        MatGridListModule,
        NgOptimizedImage,
        NgxSkeletonLoaderModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatButtonModule,
        MatInputModule
    ],
    providers: [ CookieService ]
})
export class NoticiasModule { }
