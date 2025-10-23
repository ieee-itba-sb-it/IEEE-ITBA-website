import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {WriteNewsComponent} from './pages/write-news/write-news.component';
import {EditarAnuncioComponent} from './pages/editar-anuncio/editar-anuncio.component';
import {SharedModule} from '../../shared/shared.module';
import {MissingTranslationHandler, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {QuillModule} from 'ngx-quill';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {FlexLayoutModule} from '@angular/flex-layout';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {CustomMissingTranslationHandler} from '../../shared/CustomMissingTranslationHandler';
import {MatListModule} from '@angular/material/list';
import {CardsModule, IconsModule} from 'angular-bootstrap-md';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatRadioModule} from '@angular/material/radio';
import {HttpLoaderFactory} from '../../shared/translation-helpers';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import {MatSelectModule} from "@angular/material/select";

const routes: Routes = [
    { path: '',  component: WriteNewsComponent },
    { path: ':id', component: WriteNewsComponent }
];

export const routing = RouterModule.forChild(routes);

@NgModule({
    declarations: [ WriteNewsComponent, EditarAnuncioComponent ],
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
        MatCardModule,
        MatGridListModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        QuillModule,
        MatButtonModule,
        MatInputModule,
        FlexLayoutModule,
        MatSnackBarModule,
        QuillModule.forRoot(),
        MatListModule,
        CardsModule,
        FormsModule,
        MatChipsModule,
        MatIconModule,
        MatAutocompleteModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatRadioModule,
        NgxSkeletonLoaderModule,
        IconsModule,
        MatSelectModule
    ]
})
export class WriteNewsModule { }
