import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisterRoutingModule } from './register-routing.module';
import { RegisterComponent } from './register.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import {SharedModule} from '../../../shared/shared.module';
import {MissingTranslationHandler, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {CustomMissingTranslationHandler} from '../../../shared/CustomMissingTranslationHandler';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {HttpLoaderFactory} from '../../../shared/translation-helpers';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

@NgModule({
    declarations: [RegisterComponent],
    imports: [
        CommonModule,
        SharedModule,
        TranslateModule,
        RegisterRoutingModule,
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
        MatButtonModule,
        MatCardModule,
    ]
})
export class RegisterModule {

}
