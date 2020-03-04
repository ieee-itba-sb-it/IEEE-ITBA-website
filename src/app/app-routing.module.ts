import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IeeeEventosComponent } from './ieee-eventos/ieee-eventos.component';
import { IeeextremeComponent } from './ieeextreme/ieeextreme.component';
import { MainMenuComponent } from './main-menu/main-menu.component';


const routes: Routes = [
  { path: '', component: MainMenuComponent},
  { path: 'ieeextreme', component: IeeextremeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
