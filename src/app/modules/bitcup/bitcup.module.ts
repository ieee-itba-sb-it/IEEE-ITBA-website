import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BitcupComponent } from './pages/bitcup/bitcup.component';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  { path: '',  component: BitcupComponent }
];

export const routing = RouterModule.forChild(routes);

@NgModule({
  declarations: [BitcupComponent],
  imports: [
    routing,
    CommonModule
  ]
})
export class BitcupModule { }
