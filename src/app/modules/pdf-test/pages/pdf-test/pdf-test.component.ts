import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-pdf-test",
  templateUrl: "./pdf-test.component.html",
  styleUrls: ["./pdf-test.component.css"],
})
export class PdfTestComponent implements OnInit {
  pdfSrc = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
  constructor() {}

  ngOnInit(): void {}
}
