import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import firebase from 'firebase';
import { firestore } from 'firebase/app';
import Timestamp = firestore.Timestamp;
import {SponsorsService} from 'src/app/core/services/sponsors/sponsors.service';

@Component({
  selector: 'app-data-analysis',
  templateUrl: './data-analysis.component.html',
  styleUrls: ['./data-analysis.component.css']
})
export class DataAnalysisComponent implements OnInit {
  sponsorsServiceVar: SponsorsService;
  week1ContentOpen = false;
  week2ContentOpen = false;
  week3ContentOpen = false;
  contentClosed = false;
  solution3Open = false;
  faq = [
    {q: 'DATAANALYSIS.FAQ.1.QUESTION', a: 'DATAANALYSIS.FAQ.1.ANSWER'},
    {q: 'DATAANALYSIS.FAQ.2.QUESTION', a: 'DATAANALYSIS.FAQ.2.ANSWER'},
    {q: 'DATAANALYSIS.FAQ.3.QUESTION', a: 'DATAANALYSIS.FAQ.3.ANSWER'},
    {q: 'DATAANALYSIS.FAQ.4.QUESTION', a: 'DATAANALYSIS.FAQ.4.ANSWER'},
    {q: 'DATAANALYSIS.FAQ.5.QUESTION', a: 'DATAANALYSIS.FAQ.5.ANSWER'},
  ];

  constructor(private sponsorsService: SponsorsService) {
  this.sponsorsServiceVar = sponsorsService;
  scroll(0, 0);
  this.contentClosed = this.isOldDate('31 Oct 2022 03:00:00 UTC');
  this.week1ContentOpen = this.isOldDate('19 Sep 2022 03:00:00 UTC') && !this.contentClosed;
  this.week2ContentOpen = this.isOldDate('26 Sep 2022 03:00:00 UTC') && !this.contentClosed;
  this.week3ContentOpen = this.isOldDate('03 Oct 2022 03:00:00 UTC') && !this.contentClosed;
}

isOldDate(date: string) {
    const oldDate = Timestamp.fromDate(new Date(date));
    const now = firebase.firestore.Timestamp.now();
    return now > oldDate;
  }

getCurrentTest() {
  const now = firebase.firestore.Timestamp.now();
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
    const now = firebase.firestore.Timestamp.now();
    const startDate = Timestamp.fromDate(new Date('03 Oct 2022 03:00:00 UTC'));
    const endDate = Timestamp.fromDate(new Date('10 Oct 2022 03:00:00 UTC'));
    if (startDate < now && now < endDate) {
      return true;
    }
    return false;
}

isEnrollAvailable() {
    return false;
}

ngOnInit(): void {
  }

}
