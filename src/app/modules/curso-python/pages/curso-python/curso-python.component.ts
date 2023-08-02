/*IMPORTS*/
import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/compat/app';
import Timestamp = firebase.firestore.Timestamp;

@Component({
  selector: 'app-curso-python',
  templateUrl: './curso-python.component.html',
  styleUrls: ['./curso-python.component.css'],
})
export class CursoPythonComponent implements OnInit {

  enrollLink = 'https://forms.gle/F5yVdarakDSmh3GF6';

  week1ContentLink = 'https://colab.research.google.com/github/IEEESBITBA/Curso-Python/blob/master/Curso_Introductorio_Clases/Clase_1_Introducción_a_la_Programación_con_Python.ipynb';
  week2ContentLink = 'https://colab.research.google.com/github/IEEESBITBA/Curso-Python/blob/master/Curso_Introductorio_Clases/Clase_2_Introducción_a_la_Programación_con_Python.ipynb';
  week3ContentLink = 'https://colab.research.google.com/github/IEEESBITBA/Curso-Python/blob/master/Curso_Introductorio_Clases/Clase_3_Introducción_a_la_Programación_con_Python.ipynb';

  week1SolutionsLink = 'https://colab.research.google.com/github/IEEESBITBA/Curso-Python/blob/master/Curso_Introductorio_Solucionarios/Solucionario_Clase_1_Curso_Introductorio_de_Python.ipynb';
  week2SolutionsLink = 'https://colab.research.google.com/github/IEEESBITBA/Curso-Python/blob/master/Curso_Introductorio_Solucionarios/Solucionario_Clase_2_Curso_Introductorio_de_Python.ipynb';
  week3SolutionsLink = 'https://colab.research.google.com/github/IEEESBITBA/Curso-Python/blob/master/Curso_Introductorio_Solucionarios/Solucionario_Clase_3_Curso_Introductorio_de_Python.ipynb';

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
    const now = Timestamp.now();
    return now > oldDate;
  }

  constructor() {
    scroll(0, 0);
    this.enrollOpen = this.isOldDate('27 Mar 2023 03:00:00 UTC');
    this.enrollClosed = this.isOldDate('07 Aug 2023 03:00:00 UTC');

    this.contentClosed = this.isOldDate('02 Oct 2023 03:00:00 UTC');
    this.week1ContentOpen = this.isOldDate('14 Aug 2023 03:00:00 UTC') && !this.contentClosed;
    this.week2ContentOpen = this.isOldDate('21 Aug 2023 03:00:00 UTC') && !this.contentClosed;
    this.week3ContentOpen = this.isOldDate('28 Aug 2023 03:00:00 UTC') && !this.contentClosed;
    this.week4ContentOpen = this.isOldDate('04 Sep 2023 03:00:00 UTC') && !this.contentClosed;
  }

  enrollAvailable() {
    return this.enrollOpen && !this.enrollClosed;
  }

  ngOnInit(): void { }

  check = (event, isReady) => {
    if (!isReady) {
      event.preventDefault();
    }
  }

}
