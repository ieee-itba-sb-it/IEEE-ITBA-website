import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {ContactPageComponent} from './pages/contact/contact-page.component';
import {SharedModule} from '../../shared/shared.module';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatGridListModule} from '@angular/material/grid-list';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {HttpLoaderFactory} from '../../app.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatRadioModule} from '@angular/material/radio';

const routes: Routes = [
  { path: '',  component: ContactPageComponent }
];

export const routing = RouterModule.forChild(routes);

@NgModule({
    imports: [
        routing,
        CommonModule,
        SharedModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            },
            extend: true
        }),
        MatRadioModule
    ],
  declarations: [
    ContactPageComponent
  ]
})

export class ContactModule{
}
