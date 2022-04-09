import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { RasComponent } from "./pages/ras/ras.component";
import { SharedModule } from "../../shared/shared.module";
import { MatCardModule } from "@angular/material/card";
import { MDBBootstrapModule } from "angular-bootstrap-md";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { HttpLoaderFactory } from "../../app.module";
import { HttpClient } from "@angular/common/http";
import { CarouselModule } from "ngx-owl-carousel-o";
import { FlexLayoutModule } from "@angular/flex-layout";

const routes: Routes = [{ path: "", component: RasComponent }];

export const routing = RouterModule.forChild(routes);

@NgModule({
  imports: [
    routing,
    CommonModule,
    SharedModule,
    MatCardModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    MDBBootstrapModule.forRoot(),
    CarouselModule,
    FlexLayoutModule,
  ],
  declarations: [RasComponent],
})
export class RasModule {}
