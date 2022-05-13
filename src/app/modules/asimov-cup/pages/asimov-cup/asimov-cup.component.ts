import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-asimov-cup",
  templateUrl: "./asimov-cup.component.html",
  styleUrls: ["./asimov-cup.component.css"],
})
export class AsimovCupComponent implements OnInit {
  faq = [
    { q: "ASIMOVCUP.FAQ.1.QUESTION", a: "ASIMOVCUP.FAQ.1.ANSWER" },
    { q: "ASIMOVCUP.FAQ.2.QUESTION", a: "ASIMOVCUP.FAQ.2.ANSWER" },
    { q: "ASIMOVCUP.FAQ.3.QUESTION", a: "ASIMOVCUP.FAQ.3.ANSWER" },
    { q: "ASIMOVCUP.FAQ.4.QUESTION", a: "ASIMOVCUP.FAQ.4.ANSWER" },
    { q: "ASIMOVCUP.FAQ.5.QUESTION", a: "ASIMOVCUP.FAQ.5.ANSWER" },
    { q: "ASIMOVCUP.FAQ.6.QUESTION", a: "ASIMOVCUP.FAQ.6.ANSWER" },
  ];

  schedule = [
    "ASIMOVCUP.SCHEDULE.1",
    "ASIMOVCUP.SCHEDULE.2",
    "ASIMOVCUP.SCHEDULE.3",
    "ASIMOVCUP.SCHEDULE.4",
    "ASIMOVCUP.SCHEDULE.5",
    "ASIMOVCUP.SCHEDULE.6",
    "ASIMOVCUP.SCHEDULE.7",
    "ASIMOVCUP.SCHEDULE.8",
    "ASIMOVCUP.SCHEDULE.9",
    "ASIMOVCUP.SCHEDULE.10",
  ];

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
