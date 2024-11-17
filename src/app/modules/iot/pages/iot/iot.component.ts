import {Component, OnInit} from '@angular/core';
import {Timestamp} from '@angular/fire/firestore';
import {Event, IeeeEvent} from "../../../../shared/models/event/event";
import {EventService} from "../../../../core/services/event/event.service";
import {StaticSeoService} from "../../../../core/services/seo/seo-static.service";


@Component({
    selector: 'app-iot',
    templateUrl: './iot.component.html',
    styleUrls: ['./iot.component.css']
})
export class IotComponent implements OnInit {
    event?: Event;

    imageLinks = [
        'https://i.ibb.co/h2NXFqZ/image1.jpg',
        'https://i.ibb.co/4NWyHH0/image2.jpg',
        'https://i.ibb.co/WGdj7dn/image4.jpg',
        'https://i.ibb.co/cLr94M0/image7.jpg',
        'https://i.ibb.co/YTfrKfk/image3.jpg',
        'https://i.ibb.co/HF074sP/image6.jpg'
    ];

    enrollLink = 'https://forms.gle/tWspqnnYahbbLVSF8';
    enrollEndDate = '28 Nov 2023 03:00:00 UTC';

    faq = [
        { q: 'IOT.FAQ.QUESTIONS.0.QUESTION', a: 'IOT.FAQ.QUESTIONS.0.ANSWER' },
        { q: 'IOT.FAQ.QUESTIONS.1.QUESTION', a: 'IOT.FAQ.QUESTIONS.1.ANSWER' }
    ];


    isEnrollingAvailable() {
        const now = Timestamp.now();
        return now < Timestamp.fromDate(new Date(this.enrollEndDate));
    }

    constructor(private eventService: EventService, private seoService: StaticSeoService) { }

    ngOnInit(): void {
        this.seoService.updateMetaTags('IOT.PAGETITLE', 'IOT.PAGEDESCRIPTION', ['IOT', 'IEEE', 'ITBA'], "events/iot/iot-banner.jpeg");
        this.getEvent();
    }

    getEvent(): void {
        this.eventService.getEvent(IeeeEvent.IOT_WORKSHOP)
            .subscribe(event => {
                this.event = event;
            });
    }

    updateEvent(event: Event) {
        this.event = event;
    }

}
