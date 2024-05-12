import { Component, OnInit } from '@angular/core';
import {Timestamp} from '@angular/fire/firestore';
import {EventCardData, IeeeEvent} from "../../../../shared/models/event/event-card-data";
import {EventService} from "../../../../core/services/event/event.service";

@Component({
    selector: 'app-curso-python',
    templateUrl: './curso-python.component.html',
    styleUrls: ['./curso-python.component.css'],
})
export class CursoPythonComponent implements OnInit {
    event?: EventCardData;

    enrollLink = 'https://forms.gle/F5yVdarakDSmh3GF6';

    week1ContentLink = 'https://colab.research.google.com/github/IEEESBITBA/Curso-Python/blob/master/Curso_Introductorio_Clases/Clase_1_Introducción_a_la_Programación_con_Python.ipynb';
    week2ContentLink = 'https://colab.research.google.com/github/IEEESBITBA/Curso-Python/blob/master/Curso_Introductorio_Clases/Clase_2_Introducción_a_la_Programación_con_Python.ipynb';
    week3ContentLink = 'https://colab.research.google.com/github/IEEESBITBA/Curso-Python/blob/master/Curso_Introductorio_Clases/Clase_3_Introducción_a_la_Programación_con_Python.ipynb';

    week1SolutionsLink = 'https://colab.research.google.com/github/IEEESBITBA/Curso-Python/blob/master/Curso_Introductorio_Solucionarios/Solucionario_Clase_1_Curso_Introductorio_de_Python.ipynb';
    week2SolutionsLink = 'https://colab.research.google.com/github/IEEESBITBA/Curso-Python/blob/master/Curso_Introductorio_Solucionarios/Solucionario_Clase_2_Curso_Introductorio_de_Python.ipynb';
    week3SolutionsLink = 'https://colab.research.google.com/github/IEEESBITBA/Curso-Python/blob/master/Curso_Introductorio_Solucionarios/Solucionario_Clase_3_Curso_Introductorio_de_Python.ipynb';

    week1ContentOpen = true;
    week2ContentOpen = true;
    week3ContentOpen = true;
    week4ContentOpen = false;
    contentClosed = false;

    enrollOpen = false;
    enrollClosed = false;

    faq = [
        { q: 'PYTHONCOURSES.FAQ.QUESTIONS.0.QUESTION', a: 'PYTHONCOURSES.FAQ.QUESTIONS.0.ANSWER' },
        { q: 'PYTHONCOURSES.FAQ.QUESTIONS.1.QUESTION', a: 'PYTHONCOURSES.FAQ.QUESTIONS.1.ANSWER' },
        { q: 'PYTHONCOURSES.FAQ.QUESTIONS.2.QUESTION', a: 'PYTHONCOURSES.FAQ.QUESTIONS.2.ANSWER' },
        { q: 'PYTHONCOURSES.FAQ.QUESTIONS.3.QUESTION', a: 'PYTHONCOURSES.FAQ.QUESTIONS.3.ANSWER' },
        { q: 'PYTHONCOURSES.FAQ.QUESTIONS.4.QUESTION', a: 'PYTHONCOURSES.FAQ.QUESTIONS.4.ANSWER' }
    ];

    pythonImageUrl= 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1200px-Python-logo-notext.svg.png';


    getDate() { }

    isOldDate(date: string) {
        this.getDate();
        const oldDate = Timestamp.fromDate(new Date(date));
        const now = Timestamp.now();
        return now > oldDate;
    }

    constructor(private eventService: EventService) {
        scroll(0, 0);
        // this.enrollOpen = this.isOldDate('27 Mar 2023 03:00:00 UTC');
        // this.enrollClosed = this.isOldDate('07 Aug 2023 03:00:00 UTC');
        //
        // this.contentClosed = this.isOldDate('02 Oct 2023 03:00:00 UTC');
        // this.week1ContentOpen = this.isOldDate('14 Aug 2023 03:00:00 UTC') && !this.contentClosed;
        // this.week2ContentOpen = this.isOldDate('21 Aug 2023 03:00:00 UTC') && !this.contentClosed;
        // this.week3ContentOpen = this.isOldDate('28 Aug 2023 03:00:00 UTC') && !this.contentClosed;
        // this.week4ContentOpen = this.isOldDate('04 Sep 2023 03:00:00 UTC') && !this.contentClosed;
    }

    enrollAvailable() {
        return this.enrollOpen && !this.enrollClosed;
    }

    ngOnInit(): void {
        this.getEvent();
    }

    check = (event, isReady) => {
        if (!isReady) {
            event.preventDefault();
        }
    }

    getEvent(): void {
        this.eventService.getEvent(IeeeEvent.PYTHON_COURSE)
            .subscribe(event => {
                this.event = event;
            });
    }

}
