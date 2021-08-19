import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CursoPythonComponent } from './modules/curso-python/pages/curso-python/curso-python.component';
import { MainpageComponent } from './modules/mainpage/pages/mainpage/mainpage.component';
import { NoticiaComponent } from './modules/noticias/pages/noticia/noticia.component';
import { TeamComponent } from './modules/team/pages/team/team.component';
import { EditarAnuncioComponent } from './editar-anuncio/editar-anuncio.component';
import { NoticiasComponent } from './modules/noticias/pages/noticias/noticias.component';
import { IeeextremeComponent } from './modules/ieeextreme/pages/ieeextreme/ieeextreme.component';
import { WriteNewsComponent } from './modules/write-news/write-news.component';
import { SponsorsComponent } from './modules/sponsors/pages/sponsors/sponsors.component';
import { EventsComponent } from './modules/events/pages/events/events.component';
import { Error401Component } from './error401/error401.component';

import {AuthGuardService} from './core/services/authorization-guard/auth-guard.service';
import {AngularFireAuthGuard, redirectUnauthorizedTo} from '@angular/fire/auth-guard';
import { roles } from './data-types';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

const routes: Routes = [
  { path: '', loadChildren: () => import('./modules/mainpage/mainpage.module').then(m => m.MainpageModule) },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: 'ieeextreme', loadChildren: () => import('./modules/ieeextreme/ieeextreme.module').then(m => m.IeeextremeModule) },
  { path: 'cursospython', loadChildren: () => import('./modules/curso-python/curso-python.module').then(m => m.CursoPythonModule) },
  { path: 'noticias', loadChildren: () => import('./modules/noticias/noticias.module').then(m => m.NoticiasModule) },
  { path: 'noticias/:id', loadChildren: () => import('./modules/noticias/noticias.module').then(m => m.NoticiasModule) },
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
  { path: 'sponsors', loadChildren: () => import('./modules/sponsors/sponsors.module').then(m => m.SponsorsModule) },
  { path: 'team', loadChildren: () => import('./modules/team/team.module').then(m => m.TeamModule) },
  { path: 'contact', loadChildren: () => import('./modules/contact/contact.module').then(m => m.ContactModule) },
  { path: 'events', loadChildren: () => import('./modules/events/events.module').then(m => m.EventsModule) },
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
