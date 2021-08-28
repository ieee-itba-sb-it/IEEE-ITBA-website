import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {WriteNewsComponent} from './pages/write-news/write-news.component';
import {EditarAnuncioComponent} from './pages/editar-anuncio/editar-anuncio.component';
import {SharedModule} from '../../shared/shared.module';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../app.module';
import {HttpClient} from '@angular/common/http';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatFormFieldModule} from '@angular/material/form-field';
import {ReactiveFormsModule} from '@angular/forms';
import {QuillModule} from 'ngx-quill';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {FlexLayoutModule} from '@angular/flex-layout';
import { MatSnackBarModule } from '@angular/material/snack-bar';

const routes: Routes = [
  { path: '',  component: WriteNewsComponent },
  { path: ':id', component: EditarAnuncioComponent }
];

export const routing = RouterModule.forChild(routes);

@NgModule({
  declarations: [ WriteNewsComponent, EditarAnuncioComponent ],
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
    MatCardModule,
    MatGridListModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    QuillModule,
    MatButtonModule,
    MatInputModule,
    FlexLayoutModule,
    MatSnackBarModule,
    QuillModule.forRoot()
  ]
})
export class WriteNewsModule { }
