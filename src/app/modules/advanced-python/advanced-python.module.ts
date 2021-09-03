import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdvancedPythonComponent } from './pages/advanced-python/advanced-python.component';
import {SharedModule} from '../../shared/shared.module';
import {MatCardModule} from '@angular/material/card';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../app.module';
import {HttpClient} from '@angular/common/http';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatExpansionModule} from '@angular/material/expansion';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  { path: '',  component: AdvancedPythonComponent }
];

export const routing = RouterModule.forChild(routes);

@NgModule({
  declarations: [AdvancedPythonComponent],
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
export class AdvancedPythonModule { }
