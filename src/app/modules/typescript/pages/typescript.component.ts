import { Component, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';

@Component({
    selector: 'app-typescript',
    templateUrl: './typescript.component.html',
    styleUrls: ['./typescript.component.css']
})
export class TypescriptComponent implements OnInit {

    requirementsLink = 'https://raw.githubusercontent.com/IEEESBITBA/curso-typescript/main/Anexo/Gu%C3%ADa%20de%20Instalaci%C3%B3n%20de%20Herramientas.pdf';

    enrollLink = 'https://forms.gle/v4HjXEWRJMB1E9b39';

    enrollOpen = false;
    enrollClosed = false;

    faq = [
        { q: 'TYPESCRIPT.FAQ.1.QUESTION', a: 'TYPESCRIPT.FAQ.1.ANSWER' },
        { q: 'TYPESCRIPT.FAQ.2.QUESTION', a: 'TYPESCRIPT.FAQ.2.ANSWER' },
        { q: 'TYPESCRIPT.FAQ.3.QUESTION', a: 'TYPESCRIPT.FAQ.3.ANSWER' },
        { q: 'TYPESCRIPT.FAQ.4.QUESTION', a: 'TYPESCRIPT.FAQ.4.ANSWER' },
        { q: 'TYPESCRIPT.FAQ.5.QUESTION', a: 'TYPESCRIPT.FAQ.5.ANSWER' },
        { q: 'TYPESCRIPT.FAQ.6.QUESTION', a: 'TYPESCRIPT.FAQ.6.ANSWER' }
    ];

    schedule = [
        'TYPESCRIPT.SCHEDULE.1', 'TYPESCRIPT.SCHEDULE.2', 'TYPESCRIPT.SCHEDULE.3',
        'TYPESCRIPT.SCHEDULE.4','TYPESCRIPT.SCHEDULE.5','TYPESCRIPT.SCHEDULE.6',
        'TYPESCRIPT.SCHEDULE.7','TYPESCRIPT.SCHEDULE.8','TYPESCRIPT.SCHEDULE.9',
        'TYPESCRIPT.SCHEDULE.10','TYPESCRIPT.SCHEDULE.11','TYPESCRIPT.SCHEDULE.12',
        'TYPESCRIPT.SCHEDULE.13'
    ];

    isOldDate(date: string) {
        const oldDate = Timestamp.fromDate(new Date(date));
        const now = Timestamp.now();
        return now > oldDate;
    }

    constructor() {
        this.enrollOpen = this.isOldDate('15 May 2023 03:00:00 UTC');
        this.enrollClosed = this.isOldDate('29 May 2023 03:00:00 UTC');
    }

    ngOnInit(): void {
    }

    enrollAvailable(): boolean {
        return this.enrollOpen && !this.enrollClosed;
    }

}
