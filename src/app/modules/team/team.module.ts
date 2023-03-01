import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {NoticiasComponent} from '../noticias/pages/noticias/noticias.component';
import {NoticiaComponent} from '../noticias/pages/noticia/noticia.component';
import {TeamComponent} from './pages/team/team.component';
import {TeamCardComponent} from './components/team-card/team-card.component';
import {SharedModule} from '../../shared/shared.module';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../app.module';
import {HttpClient} from '@angular/common/http';
import {MatTabsModule} from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import { IndividualCardComponent } from './components/individual-card/individual-card.component';

const routes: Routes = [
  { path: '',  component: TeamComponent }
];

export const routing = RouterModule.forChild(routes);

@NgModule({
  declarations: [ TeamComponent, TeamCardComponent, IndividualCardComponent ],
  imports: [
    routing,
    CommonModule,
    SharedModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      extend: true
    }),
    MatTabsModule,
    MatExpansionModule,
    MDBBootstrapModule.forRoot()
  ]
})
export class TeamModule { }
