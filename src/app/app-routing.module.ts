import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlogComponent } from './blog/blog.component'
import { CursoPythonComponent } from './curso-python/curso-python.component'
import { MainpageComponent } from './mainpage/mainpage.component';
import { IeeeMeetupComponent } from './ieee-meetup/ieee-meetup.component';
import { WieRecruitingComponent } from './wie-recruiting/wie-recruiting.component';
import { NoticiaComponent } from './noticia/noticia.component';
import { EditarAnuncioComponent } from './editar-anuncio/editar-anuncio.component';
import { NoticiasComponent } from './noticias/noticias.component';
import { IeeextremeComponent } from './ieeextreme/ieeextreme.component';
import { NewsMainpageComponent } from './news/news-mainpage/news-mainpage.component';
import { WriteNewsComponent } from './write-news/write-news.component';
import { SponsorsComponent } from './sponsors/sponsors.component';
import { ForumComponent } from './forum/forum.component'
import { ForumBComponent } from './forum-b/forum-b.component';
import { ForumCComponent } from './forum-c/forum-c.component';
import { ForumDComponent } from './forum-d/forum-d.component';
import { ContactPageComponent } from './contact-page/contact-page.component';


const routes: Routes = [
  { path: '', component: MainpageComponent },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: 'ieeextreme', component: IeeextremeComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'cursospython', component: CursoPythonComponent },
  { path: 'ieeemeetup', component: IeeeMeetupComponent },
  { path: 'wierecruiting', component: WieRecruitingComponent },
  { path: 'noticias/:id', component: NoticiaComponent },
  { path: 'editNoticia/:id', component: EditarAnuncioComponent },
  { path: 'noticias', component: NoticiasComponent },
  { path: 'sponsors', component: SponsorsComponent },
  { path: 'news', component: NewsMainpageComponent },
  { path: 'python', component: ForumComponent },
  { path: 'python/f/:forum_title/c/:cat_title/:tid', component: ForumComponent },
  { path: 'python/f/:forum_title/c/:cat_title', component: ForumComponent },
  { path: 'python/f/:forum_title/c', component: ForumBComponent },
  { path: 'python/f/:forum_title', component: ForumComponent },
  { path: 'python/f', component: ForumComponent },
  { path: 'contact-page', component: ContactPageComponent},

  { path: 'python/u/:uid/unsubscribe/:tid', component: ForumCComponent },
  { path: 'python/u/:uid/unsubscribe', component: ForumDComponent },
  { path: 'python/u/:uid', component: ForumCComponent },
  { path: 'python/u', component: ForumCComponent },
  
  { path: 'write-news', component: WriteNewsComponent },
  { path: 'login', loadChildren: () => import('./auth/login/login.module').then(m => m.LoginModule) },
  { path: 'register', loadChildren: () => import('./auth/register/register.module').then(m => m.RegisterModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
