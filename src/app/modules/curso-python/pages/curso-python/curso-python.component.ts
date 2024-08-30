import { Component, OnInit } from '@angular/core';
import {Timestamp} from '@angular/fire/firestore';
import {Event, IeeeEvent} from "../../../../shared/models/event/event";
import {EventService} from "../../../../core/services/event/event.service";

@Component({
    selector: 'app-curso-python',
    templateUrl: './curso-python.component.html',
    styleUrls: ['./curso-python.component.css'],
})
export class CursoPythonComponent implements OnInit {
    event?: Event;

    faq = [
        { q: 'PYTHONCOURSES.FAQ.QUESTIONS.0.QUESTION', a: 'PYTHONCOURSES.FAQ.QUESTIONS.0.ANSWER' },
        { q: 'PYTHONCOURSES.FAQ.QUESTIONS.1.QUESTION', a: 'PYTHONCOURSES.FAQ.QUESTIONS.1.ANSWER' },
        { q: 'PYTHONCOURSES.FAQ.QUESTIONS.2.QUESTION', a: 'PYTHONCOURSES.FAQ.QUESTIONS.2.ANSWER' },
        { q: 'PYTHONCOURSES.FAQ.QUESTIONS.3.QUESTION', a: 'PYTHONCOURSES.FAQ.QUESTIONS.3.ANSWER' },
        { q: 'PYTHONCOURSES.FAQ.QUESTIONS.4.QUESTION', a: 'PYTHONCOURSES.FAQ.QUESTIONS.4.ANSWER' }
    ];

    pythonImageUrl= 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1200px-Python-logo-notext.svg.png';

    constructor(private eventService: EventService) {
        scroll(0, 0);
    }

    ngOnInit(): void {
        this.getEvent();
    }

    getEvent(): void {
        this.eventService.getEvent(IeeeEvent.PYTHON_COURSE)
            .subscribe(event => {
                this.event = event;
            });
    }

    updateEvent(event: Event) {
        this.event = event;
    }
}
