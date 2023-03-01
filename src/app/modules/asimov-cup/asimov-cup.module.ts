import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {AsimovCupComponent} from './pages/asimov-cup/asimov-cup.component';
import {SharedModule} from '../../shared/shared.module';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../app.module';
import {HttpClient} from '@angular/common/http';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCardModule} from '@angular/material/card';
import {FlexLayoutModule} from '@angular/flex-layout';

const routes: Routes = [
  { path: '',  component: AsimovCupComponent }
];

export const routing = RouterModule.forChild(routes);

@NgModule({
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
    MatExpansionModule,
    MatCardModule,
    FlexLayoutModule
  ],
  declarations: [AsimovCupComponent],
})
export class AsimovCupModule { }
