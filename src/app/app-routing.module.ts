import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CursoPythonComponent } from './curso-python/curso-python.component';
import { MainpageComponent } from './mainpage/mainpage.component';
import { IeeeMeetupComponent } from './ieee-meetup/ieee-meetup.component';
import { NoticiaComponent } from './noticia/noticia.component';
import { TeamComponent } from './team/team.component';
import { EditarAnuncioComponent } from './editar-anuncio/editar-anuncio.component';
import { NoticiasComponent } from './noticias/noticias.component';
import { IeeextremeComponent } from './ieeextreme/ieeextreme.component';
import { WriteNewsComponent } from './write-news/write-news.component';
import { SponsorsComponent } from './sponsors/sponsors.component';
import { ContactPageComponent } from './contact-page/contact-page.component';
import { EventsComponent } from './events/events.component';
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
  { path: 'ieeemeetup', component: IeeeMeetupComponent },
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
  { path: 'contact', component: ContactPageComponent},
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
