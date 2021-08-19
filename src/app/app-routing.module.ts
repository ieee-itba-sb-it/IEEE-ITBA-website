import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CursoPythonComponent } from './modules/curso-python/curso-python.component';
import { MainpageComponent } from './modules/mainpage/mainpage.component';
import { NoticiaComponent } from './modules/noticia/noticia.component';
import { TeamComponent } from './modules/team/team.component';
import { EditarAnuncioComponent } from './editar-anuncio/editar-anuncio.component';
import { NoticiasComponent } from './modules/noticias/noticias.component';
import { IeeextremeComponent } from './modules/ieeextreme/ieeextreme.component';
import { WriteNewsComponent } from './modules/write-news/write-news.component';
import { SponsorsComponent } from './modules/sponsors/sponsors.component';
import { EventsComponent } from './modules/events/events.component';
import { Error401Component } from './error401/error401.component';

import {AuthGuardService} from './core/services/auth-guard.service';
import {AngularFireAuthGuard, redirectUnauthorizedTo} from '@angular/fire/auth-guard';
import { roles } from './data-types';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

const routes: Routes = [
  { path: '', component: MainpageComponent },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: 'ieeextreme', component: IeeextremeComponent },
  { path: 'cursospython', component: CursoPythonComponent },
  { path: 'noticias/:id', component: NoticiaComponent },
  {
    path: 'editNoticia/:id',
    component: EditarAnuncioComponent,
    canActivate: [AuthGuardService],
    data: {
      expectedRole: [roles.contentCreator, roles.admin]
    }
    // canActivate: [AngularFireAuthGuard],
    // data: { authGuardPipe: redirectUnauthorizedToLogin }
  },
  { path: 'noticias', component: NoticiasComponent },
  { path: 'sponsors', component: SponsorsComponent },
  { path: 'team', component: TeamComponent },
  {
    path: 'contact',
    loadChildren: () => import('./modules/contact/contact.module').then(m => m.ContactModule)
  },
  { path: 'events', component: EventsComponent},
  { path: 'error401', component: Error401Component},

  {
    path: 'write-news',
    component: WriteNewsComponent,
    canActivate: [AuthGuardService],
    data: {
      expectedRole: [roles.contentCreator, roles.admin]
    }
    // canActivate: [AngularFireAuthGuard],
    // data: { authGuardPipe: redirectUnauthorizedToLogin }
  },
  { path: 'login', loadChildren: () => import('./core/authentication/login/login.module').then(m => m.LoginModule) },
  { path: 'register', loadChildren: () => import('./core/authentication/register/register.module').then(m => m.RegisterModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
