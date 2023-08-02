import { Component, OnInit } from '@angular/core';

import { SponsorsService } from 'src/app/core/services/sponsors/sponsors.service';
import firebase from 'firebase/compat/app';
import Timestamp = firebase.firestore.Timestamp;

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
    const now = Timestamp.now();
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
    const now = Timestamp.now();
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
