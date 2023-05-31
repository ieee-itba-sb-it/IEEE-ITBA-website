/*IMPORTS*/
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import firebase from 'firebase';
import { firestore } from 'firebase/app';
import Timestamp = firestore.Timestamp;
@Component({
  selector: 'app-curso-python',
  templateUrl: './curso-python.component.html',
  styleUrls: ['./curso-python.component.css'],
})
export class CursoPythonComponent implements OnInit {

  enrollLink = 'https://forms.gle/hjEJoZT1iCDAfNW27';

  week1ContentOpen = false;
  week2ContentOpen = false;
  week3ContentOpen = false;
  week4ContentOpen = false;
  contentClosed = false;

  enrollOpen = false;
  enrollClosed = false;

  getDate() { }

  isOldDate(date: string) {
    this.getDate();
    const oldDate = Timestamp.fromDate(new Date(date));
    const now = firebase.firestore.Timestamp.now();
    return now > oldDate;
  }

  constructor() {
    scroll(0, 0);
    this.enrollOpen = this.isOldDate('27 Mar 2023 03:00:00 UTC');
    this.enrollClosed = this.isOldDate('24 Apr 2023 03:00:00 UTC');

    this.contentClosed = this.isOldDate('19 Jun 2023 03:00:00 UTC');
    this.week1ContentOpen = this.isOldDate('01 May 2023 03:00:00 UTC') && !this.contentClosed;
    this.week2ContentOpen = this.isOldDate('08 May 2023 03:00:00 UTC') && !this.contentClosed;
    this.week3ContentOpen = this.isOldDate('15 May 2023 03:00:00 UTC') && !this.contentClosed;
    this.week4ContentOpen = this.isOldDate('22 May 2023 03:00:00 UTC') && !this.contentClosed;
  }

  enrollAvailable() {
    return this.enrollOpen && !this.enrollClosed;
  }

  ngOnInit(): void { }
}
