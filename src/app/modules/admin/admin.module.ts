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
import {MDBBootstrapModule, TooltipModule} from 'angular-bootstrap-md';
import { UsersComponent } from './pages/users/users.component';
import { MatChipsModule } from '@angular/material/chips';
import {MatPaginatorModule} from '@angular/material/paginator';
import { CommissionsComponent } from './pages/commissions/commissions.component';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { CommissionEditorModalComponent } from './components/commission-editor-modal/commission-editor-modal.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PositionEditorModalComponent } from './components/position-editor-modal/position-editor-modal.component';
import {MatTableModule} from "@angular/material/table";
import { TeamRequestsComponent } from './pages/team-requests/team-requests.component';

// Tab manager
const routes: Routes = [{
    path: '',
    component: AdminComponent,
    children: [
        { path: '', redirectTo: 'users', pathMatch: 'full' },
        { path: 'users', component: UsersComponent },
        { path: 'commissions', component: CommissionsComponent },
        { path: 'team-requests', component: TeamRequestsComponent },
    ]
}];

export const routing = RouterModule.forChild(routes);

@NgModule({
    declarations: [
        AdminComponent,
        UsersComponent,
        CommissionsComponent,
        CommissionEditorModalComponent,
        PositionEditorModalComponent,
        TeamRequestsComponent
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
        MatInputModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
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
        MatTableModule,
    ]
})
export class AdminModule { }
