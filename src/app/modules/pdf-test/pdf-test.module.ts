import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PdfTestComponent } from "./pages/pdf-test/pdf-test.component";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../../shared/shared.module";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { HttpLoaderFactory } from "../../app.module";
import { HttpClient } from "@angular/common/http";
import { PdfViewerModule } from "ng2-pdf-viewer";

const routes: Routes = [{ path: "", component: PdfTestComponent }];
export const routing = RouterModule.forChild(routes);

@NgModule({
  declarations: [PdfTestComponent],
  imports: [
    routing,
    CommonModule,
    SharedModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    PdfViewerModule,
  ],
})
export class PdfTestModule {}
