import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-about-us",
  templateUrl: "./about-us.component.html",
  styleUrls: ["./about-us.component.css"],
})
export class AboutUsComponent implements OnInit {
  constructor(public translate: TranslateService) {
    scroll(0, 0);
    translate.addLangs(["en", "es"]);
    translate.setDefaultLang("es");
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/es|en/) ? browserLang : "en");
  }
  useLanguage(language: string) {
    this.translate.use(language);
  }

  ngOnInit(): void {}
}
