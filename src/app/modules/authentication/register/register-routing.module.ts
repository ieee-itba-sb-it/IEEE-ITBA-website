import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterComponent } from './register.component';

import {AngularFireAuthModule} from '@angular/fire/compat/auth';

const routes: Routes = [{ path: '', component: RegisterComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes),
        AngularFireAuthModule
    ],
    exports: [RouterModule]
})
export class RegisterRoutingModule { }
