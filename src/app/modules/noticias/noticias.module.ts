import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {MainpageComponent} from '../mainpage/pages/mainpage/mainpage.component';
import {NoticiasComponent} from './pages/noticias/noticias.component';
import {NoticiaComponent} from './pages/noticia/noticia.component';
import {SharedModule} from '../../shared/shared.module';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../app.module';
import {HttpClient} from '@angular/common/http';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatCardModule} from '@angular/material/card';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {MatChipsModule} from '@angular/material/chips';
import {EmojiModule} from '@ctrl/ngx-emoji-mart/ngx-emoji';

const routes: Routes = [
  { path: '',  component: NoticiasComponent },
  { path: ':id', component: NoticiaComponent }
];

export const routing = RouterModule.forChild(routes);

@NgModule({
  declarations: [ NoticiaComponent, NoticiasComponent ],
  imports: [
    routing,
    CommonModule,
    SharedModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    FlexLayoutModule,
    MatCardModule,
    MDBBootstrapModule.forRoot(),
    MatChipsModule,
    EmojiModule
  ]
})
export class NoticiasModule { }
