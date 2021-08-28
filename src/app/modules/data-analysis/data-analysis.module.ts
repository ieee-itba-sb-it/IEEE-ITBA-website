import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataAnalysisComponent } from './pages/data-analysis/data-analysis.component';
import {MatCardModule} from '@angular/material/card';
import {SharedModule} from '../../shared/shared.module';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatExpansionModule} from '@angular/material/expansion';
import {RouterModule, Routes} from '@angular/router';
import {CursoPythonComponent} from '../curso-python/pages/curso-python/curso-python.component';
import {HttpLoaderFactory} from '../../app.module';
import {HttpClient} from '@angular/common/http';

const routes: Routes = [
  { path: '',  component: DataAnalysisComponent }
];

export const routing = RouterModule.forChild(routes);

@NgModule({
  declarations: [DataAnalysisComponent],
  imports: [
    routing,
    CommonModule,
    SharedModule,
    MatCardModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    FlexLayoutModule,
    MatExpansionModule
  ]
})
export class DataAnalysisModule { }
