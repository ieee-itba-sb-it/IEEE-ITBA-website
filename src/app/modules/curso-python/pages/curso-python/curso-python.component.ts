/*IMPORTS*/
import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import firebase from "firebase";
import { firestore } from "firebase/app";
import Timestamp = firestore.Timestamp;

@Component({
  selector: "app-curso-python",
  templateUrl: "./curso-python.component.html",
  styleUrls: ["./curso-python.component.css"],
})
export class CursoPythonComponent implements OnInit {

  enrollLink: string = 'https://docs.google.com/forms/d/e/1FAIpQLSdBN80HmfWRXwRUHgSVcdqkpvOylsvF46AHMyP6Vtq0G2MDeg/viewform?usp=sf_link';
  class1Open: boolean = false;
  class2Open: boolean = false;
  class3Open: boolean = false;
  solution3Open: boolean = false;

  //ojala no tuviera que hardcodear asi, pero no encontre una forma de pasarle el string y concatenarlo con otros en el translate
  faq = [
    { q: "PYTHONCOURSES.FAQ.1.QUESTION", a: "PYTHONCOURSES.FAQ.1.ANSWER" },
    { q: "PYTHONCOURSES.FAQ.2.QUESTION", a: "PYTHONCOURSES.FAQ.2.ANSWER" },
    { q: "PYTHONCOURSES.FAQ.3.QUESTION", a: "PYTHONCOURSES.FAQ.3.ANSWER" },
    { q: "PYTHONCOURSES.FAQ.4.QUESTION", a: "PYTHONCOURSES.FAQ.4.ANSWER" },
    { q: "PYTHONCOURSES.FAQ.5.QUESTION", a: "PYTHONCOURSES.FAQ.5.ANSWER" },
  ];

  getDate() {}

  isOldDate(date: string) {
    this.getDate();
    let oldDate = Timestamp.fromDate(new Date(date));
    let now = firebase.firestore.Timestamp.now();
    return now > oldDate;
  }

  constructor(public translate: TranslateService) {
    scroll(0, 0);
    translate.addLangs(["en", "es"]);
    translate.setDefaultLang("es");
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/es|en/) ? browserLang : "en");
    this.class1Open = this.isOldDate("07 Aug 2022 03:00:00 UTC");
    this.class2Open = this.isOldDate("14 Aug 2022 03:00:00 UTC");
    this.class3Open = this.isOldDate("21 Aug 2022 03:00:00 UTC");
    this.solution3Open = this.isOldDate("28 Aug 2022 03:00:00 UTC");
  }

  useLanguage(language: string) {
    this.translate.use(language);
  }

  ngOnInit(): void {}
}
