import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterComponent } from './register.component';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AuthService } from 'src/app/core/services/authorization/auth.service';

const routes: Routes = [{ path: '', component: RegisterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes),
    AngularFireAuthModule
  ],
  providers: [AuthService],
  exports: [RouterModule]
})
export class RegisterRoutingModule { }
