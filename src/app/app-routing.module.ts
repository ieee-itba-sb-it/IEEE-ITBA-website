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
import { IeeeMeetupComponent } from './ieee-meetup/ieee-meetup.component';
import { WieRecruitingComponent } from './wie-recruiting/wie-recruiting.component';
import { NoticiaComponent } from './noticia/noticia.component';
import { EditarAnuncioComponent } from './editar-anuncio/editar-anuncio.component';
import { NoticiasComponent } from './noticias/noticias.component';

const routes: Routes = [
  { path: '', component: MainpageComponent},
  { path: 'ieeextreme', component: NewieeextremeComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'cursospython', component: CursoPythonComponent },
  { path: 'ieeemeetup', component: IeeeMeetupComponent },
  { path: 'wierecruiting', component: WieRecruitingComponent },
  { path: 'noticias/:id', component: NoticiaComponent},
  { path: 'editNoticia/:id', component: EditarAnuncioComponent},
  { path: 'noticias', component: NoticiasComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
