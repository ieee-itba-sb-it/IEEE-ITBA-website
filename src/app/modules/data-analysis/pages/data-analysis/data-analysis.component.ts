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

isOldDate(date: string) {
    let oldDate = Timestamp.fromDate(new Date(date));
    let now = firebase.firestore.Timestamp.now();
    return now > oldDate;
  }

getCurrentTest() {
  let now = firebase.firestore.Timestamp.now();
  if (now > Timestamp.fromDate(new Date('09 Oct 2022 03:00:00 UTC'))) {
    return 'https://forms.gle/vd3ado6TurViy67b9';
  }
  else if (now > Timestamp.fromDate(new Date('08 Oct 2022 03:00:00 UTC'))) {
    return 'https://forms.gle/5r8dmz2vAvUgXUbm9';
  }
  else if (now > Timestamp.fromDate(new Date('07 Oct 2022 03:00:00 UTC'))) {
    return 'https://forms.gle/wCRksx3hA1QiPazx9';
  }
  else if (now > Timestamp.fromDate(new Date('06 Oct 2022 03:00:00 UTC'))) {
    return 'https://forms.gle/ir4mXqLooAYx4oV76';
  }
  else if (now > Timestamp.fromDate(new Date('05 Oct 2022 03:00:00 UTC'))) {
    return 'https://forms.gle/2dYjc3B4FRZqj4nD6';
  }
  else if (now > Timestamp.fromDate(new Date('04 Oct 2022 03:00:00 UTC'))) {
    return 'https://forms.gle/FZEsP5FaszstpCj57';
  }
  return 'https://forms.gle/Btg5eaZDtfQpZDUdA';
}

hasTestsAvailable() {
    let now = firebase.firestore.Timestamp.now();
    let startDate = Timestamp.fromDate(new Date('03 Oct 2022 03:00:00 UTC'));
    let endDate = Timestamp.fromDate(new Date('10 Oct 2022 03:00:00 UTC'));
    if (startDate < now && now < endDate) {
      return true;
    }
    return false;
}

useLanguage(language: string) {
  this.translate.use(language);
}

ngOnInit(): void {
  }

}
