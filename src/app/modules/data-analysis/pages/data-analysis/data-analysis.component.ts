import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import firebase from "firebase";
import { firestore } from "firebase/app";
import Timestamp = firestore.Timestamp;

@Component({
  selector: 'app-data-analysis',
  templateUrl: './data-analysis.component.html',
  styleUrls: ['./data-analysis.component.css']
})
export class DataAnalysisComponent implements OnInit {
  class1Open: boolean = false;
  class2Open: boolean = false;
  class3Open: boolean = false;
  solution3Open: boolean = false;
  faq = [
    {q: 'DATAANALYSIS.FAQ.1.QUESTION', a: 'DATAANALYSIS.FAQ.1.ANSWER'},
    {q: 'DATAANALYSIS.FAQ.2.QUESTION', a: 'DATAANALYSIS.FAQ.2.ANSWER'},
    {q: 'DATAANALYSIS.FAQ.3.QUESTION', a: 'DATAANALYSIS.FAQ.3.ANSWER'},
    {q: 'DATAANALYSIS.FAQ.4.QUESTION', a: 'DATAANALYSIS.FAQ.4.ANSWER'},
    {q: 'DATAANALYSIS.FAQ.5.QUESTION', a: 'DATAANALYSIS.FAQ.5.ANSWER'},
  ];
isOldDate(date: string) {
    let oldDate = Timestamp.fromDate(new Date(date));
    let now = firebase.firestore.Timestamp.now();
    return now > oldDate;
  }
  constructor(public translate: TranslateService) {
  scroll(0, 0);
  translate.addLangs(['en', 'es']);
  translate.setDefaultLang('es');
  const browserLang = translate.getBrowserLang();
  translate.use(browserLang.match(/es|en/) ? browserLang : 'en');
  this.class1Open = this.isOldDate("19 Sep 2022 03:00:00 UTC");
  this.class2Open = this.isOldDate("26 Sep 2022 03:00:00 UTC");
  this.class3Open = this.isOldDate("03 Oct 2022 03:00:00 UTC");
}

useLanguage(language: string) {
  this.translate.use(language);
}

ngOnInit(): void {
  }

}
