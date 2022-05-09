import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Error401Component } from './shared/components/error401/error401.component';

import {AuthGuardService} from './core/services/authorization-guard/auth-guard.service';
import { redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { roles } from './shared/models/roles/roles.enum';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

const routes: Routes = [
  { path: '', loadChildren: () => import('./modules/mainpage/mainpage.module').then(m => m.MainpageModule) },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  {path: 'ras', loadChildren: () => import('./modules/ras/ras.module').then(m => m.RasModule)},
  { path: 'ieeextreme', loadChildren: () => import('./modules/ieeextreme/ieeextreme.module').then(m => m.IeeextremeModule) },
  { path: 'cursospython', loadChildren: () => import('./modules/curso-python/curso-python.module').then(m => m.CursoPythonModule) },
  { path: 'noticias', loadChildren: () => import('./modules/noticias/noticias.module').then(m => m.NoticiasModule) },
  { path: 'noticias/:id', loadChildren: () => import('./modules/noticias/noticias.module').then(m => m.NoticiasModule) },
  { path: 'sponsors', loadChildren: () => import('./modules/sponsors/sponsors.module').then(m => m.SponsorsModule) },
  { path: 'team', loadChildren: () => import('./modules/team/team.module').then(m => m.TeamModule) },
  { path: 'contact', loadChildren: () => import('./modules/contact/contact.module').then(m => m.ContactModule) },
  { path: 'events', loadChildren: () => import('./modules/events/events.module').then(m => m.EventsModule) },
  { path: 'bitcup', loadChildren: () => import('./modules/bitcup/bitcup.module').then(m => m.BitcupModule) },
  { path: 'data-analysis', loadChildren: () => import('./modules/data-analysis/data-analysis.module').then(m => m.DataAnalysisModule) },
  { path: 'error401', component: Error401Component},
  {
    path: 'write-news',
    loadChildren: () => import('./modules/write-news/write-news.module').then(m => m.WriteNewsModule),
    canActivate: [AuthGuardService],
    data: {
      expectedRole: [roles.contentCreator, roles.admin]
    }
    // canActivate: [AngularFireAuthGuard],
    // data: { authGuardPipe: redirectUnauthorizedToLogin }
  },
  {
    // TODO: Change this, it should refer to a single new
    path: 'write-news/:id',
    loadChildren: () => import('./modules/write-news/write-news.module').then(m => m.WriteNewsModule),
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
