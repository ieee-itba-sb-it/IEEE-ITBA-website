import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterComponent } from './register.component';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AuthService } from 'src/app/auth.service';

const routes: Routes = [{ path: '', component: RegisterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes),
    AngularFireAuthModule
  ],
  providers: [AuthService],
  exports: [RouterModule]
})
export class RegisterRoutingModule { }
