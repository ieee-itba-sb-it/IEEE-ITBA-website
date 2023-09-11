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

  week1ContentLink = 'https://colab.research.google.com/github/IEEESBITBA/Curso-python/blob/master/Curso_Analisis_de_Datos_Clases/Clase_1_Analisis_de_Datos.ipynb';
  week1SolutionsLink = 'https://colab.research.google.com/github/IEEESBITBA/Curso-python/blob/master/Curso_Analisis_de_Datos_Solucionarios/Solucionario_Clase_1.ipynb';

  week2ContentLink = 'https://colab.research.google.com/github/IEEESBITBA/Curso-python/blob/master/Curso_Analisis_de_Datos_Clases/Clase_2_Analisis_de_Datos.ipynb';
  week2SolutionsLink = 'https://colab.research.google.com/github/IEEESBITBA/Curso-python/blob/master/Curso_Analisis_de_Datos_Solucionarios/Solucionario_Clase_2.ipynb';

  week1ContentOpen = false;
  week2ContentOpen = false;
  week3ContentOpen = false;
  contentClosed = false;

  enrollOpen = false;
  enrollClosed = false;
  enrollLink = 'https://forms.gle/BiCzJWPADYmQwYvFA';

  constructor(private sponsorsService: SponsorsService) {
    this.sponsorsServiceVar = sponsorsService;
    scroll(0, 0);

    this.enrollOpen = this.isOldDate('11 Sep 2023 03:00:00 UTC');
    this.enrollClosed = this.isOldDate('18 Sep 2023 03:00:00 UTC');

    this.contentClosed = this.isOldDate('30 Oct 2023 03:00:00 UTC');
    this.week1ContentOpen = this.isOldDate('18 Sep 2023 03:00:00 UTC') && !this.contentClosed;
    this.week2ContentOpen = this.isOldDate('25 Sep 2023 03:00:00 UTC') && !this.contentClosed;
    this.week3ContentOpen = this.isOldDate('02 Oct 2023 03:00:00 UTC') && !this.contentClosed;
  }

  isOldDate(date: string) {
    const oldDate = Timestamp.fromDate(new Date(date));
    const now = Timestamp.now();
    return now > oldDate;
  }

  getCurrentTest() {
    const now = firebase.firestore.Timestamp.now();
    const firstTestDate = new Date('02 Oct 2023 03:00:00 UTC');
    const testLinks = [                       // Links in chronological order
      'https://forms.gle/Btg5eaZDtfQpZDUdA',
      'https://forms.gle/FZEsP5FaszstpCj57',
      'https://forms.gle/2dYjc3B4FRZqj4nD6',
      'https://forms.gle/ir4mXqLooAYx4oV76',
      'https://forms.gle/wCRksx3hA1QiPazx9',
      'https://forms.gle/5r8dmz2vAvUgXUbm9',
      'https://forms.gle/vd3ado6TurViy67b9'
    ];

    for (let days=testLinks.length-1 ; days >= 0 ; days--) {
      let testDate = new Date(firstTestDate);
      testDate.setDate(testDate.getDate() + days);
      if (now > Timestamp.fromDate(testDate)) {
        return testLinks[days];
      }
    }

    // Fallback, should not happen
    return '';
  }

  hasTestsAvailable() {
    const now = Timestamp.now();
    const startDate = Timestamp.fromDate(new Date('02 Oct 2023 03:00:00 UTC'));
    const endDate = Timestamp.fromDate(new Date('09 Oct 2023 03:00:00 UTC'));
    return startDate < now && now < endDate;
  }

  enrollAvailable() {
    return this.enrollOpen && !this.enrollClosed;
  }

  check = (event, isReady) => {
    if (!isReady) {
      event.preventDefault();
    }
  }

  ngOnInit(): void {
  }

}
