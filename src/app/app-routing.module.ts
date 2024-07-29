import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Error401Component } from './shared/components/error401/error401.component';

import { AuthGuardService } from './core/services/authorization-guard/auth-guard.service';
import {
    redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';
import { roles } from './shared/models/roles/roles.enum';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

const routes: Routes = [
    {
        path: '',
        loadChildren: () =>
            import('./modules/mainpage/mainpage.module').then(
                (m) => m.MainpageModule
            ),
    },
    { path: 'home', redirectTo: '', pathMatch: 'full' },
    {
        path: 'ras',
        loadChildren: () =>
            import('./modules/ras/ras.module').then((m) => m.RasModule),
    },
    {
        path: 'emb',
        loadChildren: () =>
            import('./modules/emb/emb.module').then((m) => m.EmbModule),
    },
    {
        path: 'ieeextreme',
        loadChildren: () =>
            import('./modules/ieeextreme/ieeextreme.module').then(
                (m) => m.IeeextremeModule
            ),
    },
    {
        path: 'cursospython',
        loadChildren: () =>
            import('./modules/curso-python/curso-python.module').then(
                (m) => m.CursoPythonModule
            ),
    },
    {
        path: 'asimovcup',
        loadChildren: () =>
            import('./modules/asimov-cup/asimov-cup.module').then(
                (m) => m.AsimovCupModule
            ),
    },
    {
        path: 'noticias',
        loadChildren: () =>
            import('./modules/noticias/noticias.module').then(
                (m) => m.NoticiasModule
            ),
    },
    {
        path: 'noticias/:id',
        loadChildren: () =>
            import('./modules/noticias/noticias.module').then(
                (m) => m.NoticiasModule
            ),
    },
    {
        path: 'iot',
        loadChildren: () =>
            import('./modules/iot/iot.module').then(
                (m) => m.IotModule
            )
    },
    {
        path: 'wie',
        loadChildren: () =>
            import('./modules/wie/wie.module').then(
                (m) => m.WieModule
            )
    },
    {
        path: 'sponsors',
        loadChildren: () =>
            import('./modules/sponsors/sponsors.module').then(
                (m) => m.SponsorsModule
            ),
    },
    {
        path: 'team',
        loadChildren: () =>
            import('./modules/team/team.module').then((m) => m.TeamModule),
    },
    {
        path: 'about-us',
        loadChildren: () =>
            import('./modules/about-us/about-us.module').then((m) => m.AboutUsModule),
    },
    {
        path: 'contact',
        loadChildren: () =>
            import('./modules/contact/contact.module').then((m) => m.ContactModule),
    },
    {
        path: 'events',
        loadChildren: () =>
            import('./modules/events/events.module').then((m) => m.EventsModule),
    },
    {
        path: 'bitcup',
        loadChildren: () =>
            import('./modules/bitcup/bitcup.module').then((m) => m.BitcupModule),
    },
    {
        path: 'data-analysis',
        loadChildren: () =>
            import('./modules/data-analysis/data-analysis.module').then(
                (m) => m.DataAnalysisModule
            ),
    },
    {
        path: 'curso-typescript',
        loadChildren: () =>
            import('./modules/typescript/typescript.module').then(
                (m) => m.TypescriptModule
            ),
    },
    { path: 'error401', component: Error401Component },
    {
        path: 'write-news',
        loadChildren: () =>
            import('./modules/write-news/write-news.module').then(
                (m) => m.WriteNewsModule
            ),
        canActivate: [AuthGuardService],
        data: {
            expectedRole: [roles.contentCreator, roles.admin],
        },
    // canActivate: [AngularFireAuthGuard],
    // data: { authGuardPipe: redirectUnauthorizedToLogin }
    },
    {
        path: 'write-news/:id',
        loadChildren: () =>
            import('./modules/write-news/write-news.module').then(
                (m) => m.WriteNewsModule
            ),
        canActivate: [AuthGuardService],
        data: {
            expectedRole: [roles.contentCreator, roles.admin],
        },
    // canActivate: [AngularFireAuthGuard],
    // data: { authGuardPipe: redirectUnauthorizedToLogin }
    },
    {
        path: 'login',
        loadChildren: () =>
            import('./modules/authentication/login/login.module').then(
                (m) => m.LoginModule
            ),
    },
    {
        path: 'register',
        loadChildren: () =>
            import('./modules/authentication/register/register.module').then(
                (m) => m.RegisterModule
            ),
    },
    {
        path: 'profile',
        loadChildren: () =>
            import('./modules/authentication/profile/profile.module').then(
                (m) => m.ProfileModule
            ),
        canActivate: [AuthGuardService],
    },
    {
        path: 'admin',
        loadChildren: () =>
            import('./modules/admin/admin.module').then(
                (m) => m.AdminModule
            ),
        canActivate: [AuthGuardService],
        data: {
            expectedRole: [roles.admin],
        },
    },
    {
        path: '**',
        loadChildren: () =>
            import('./modules/error404/error404.module').then(
                (m) => m.Error404Module
            ),
    },
    {
        path: 'Sponsors',
        loadChildren: () =>
            import('./modules/sponsors/sponsors.module').then(
                (m) => m.SponsorsModule
            ),
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        scrollPositionRestoration: 'enabled',
        bindToComponentInputs: true
    })],
    exports: [RouterModule],
})
export class AppRoutingModule { }
