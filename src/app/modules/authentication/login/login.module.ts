import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import {SharedModule} from '../../../shared/shared.module';
import {MissingTranslationHandler, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {CustomMissingTranslationHandler} from '../../../shared/CustomMissingTranslationHandler';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {HttpLoaderFactory} from '../../../shared/translation-helpers';
import { MDBBootstrapModule } from 'angular-bootstrap-md';


@NgModule({
    declarations: [LoginComponent],
    imports: [
        CommonModule,
        SharedModule,
        TranslateModule,
        LoginRoutingModule,
        MatFormFieldModule,
        MatInputModule,
        MatGridListModule,
        MDBBootstrapModule.forRoot(),
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
            missingTranslationHandler: {provide: MissingTranslationHandler, useClass: CustomMissingTranslationHandler},
            extend: true
        }),
        MatCardModule,
        MatButtonModule,
    ]
})
export class LoginModule { }
