import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './pages/profile/profile.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { SecurityComponent } from './tabs/security/security.component';
import { GeneralComponent } from './tabs/general/general.component';
import { MatListModule } from '@angular/material/list';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { MissingTranslationHandler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/shared/translation-helpers';
import { HttpClient } from '@angular/common/http';
import { CustomMissingTranslationHandler } from 'src/app/shared/CustomMissingTranslationHandler';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

const routes: Routes = [{ 
  path: '',  
  component: ProfileComponent,
  children: [
    { path: '', redirectTo: 'general', pathMatch: 'full' },
    { path: 'general', component: GeneralComponent },
    { path: 'security', component: SecurityComponent }
]
}];

export const routing = RouterModule.forChild(routes);

@NgModule({
  declarations: [
    ProfileComponent,
    SecurityComponent,
    GeneralComponent
  ],
  imports: [
    routing,
    CommonModule,
    SharedModule,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
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
  ]
})
export class ProfileModule { }
