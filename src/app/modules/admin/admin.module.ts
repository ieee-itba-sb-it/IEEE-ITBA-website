import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './pages/admin/admin.component';
import { MissingTranslationHandler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/shared/translation-helpers';
import { HttpClient } from '@angular/common/http';
import { CustomMissingTranslationHandler } from 'src/app/shared/CustomMissingTranslationHandler';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { UsersComponent } from './pages/users/users.component';
import { MatChipsModule } from '@angular/material/chips';
import {MatPaginatorModule} from '@angular/material/paginator';
import { CommissionsComponent } from './pages/commissions/commissions.component';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';

// Tab manager
const routes: Routes = [{ 
  path: '', 
  component: AdminComponent, 
  children: [
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      { path: 'users', component: UsersComponent },
      { path: 'commissions', component: CommissionsComponent }
  ]
}];

export const routing = RouterModule.forChild(routes);

@NgModule({
  declarations: [
    AdminComponent,
    UsersComponent,
    CommissionsComponent
  ],
  imports: [
    routing,
    CommonModule,
    SharedModule,
    MatDividerModule,
    MatListModule,
    MatChipsModule,
    MatPaginatorModule,
    MatButtonModule,
    MatExpansionModule,
    CdkDrag,
    CdkDropList,
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
export class AdminModule { }
