import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IeeeEventosComponent } from './ieee-eventos/ieee-eventos.component';
import { IeeextremeComponent } from './ieeextreme/ieeextreme.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { NuevoComponentComponent } from './nuevo-component/nuevo-component.component';
import { BlogComponent } from './blog/blog.component'
import { CursoPythonComponent } from './curso-python/curso-python.component'
import { MainpageComponent } from './mainpage/mainpage.component';
import { NewieeextremeComponent } from './newieeextreme/newieeextreme.component';

const routes: Routes = [
  { path: '', component: MainMenuComponent},
  { path: 'newmain', component: MainpageComponent},
  { path: 'ieeextreme', component: NewieeextremeComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'cursospython', component: CursoPythonComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
