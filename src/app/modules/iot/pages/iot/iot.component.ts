import { Component, OnInit } from '@angular/core';
import {Timestamp} from '@angular/fire/firestore';


@Component({
    selector: 'app-iot',
    templateUrl: './iot.component.html',
    styleUrls: ['./iot.component.css']
})
export class IotComponent implements OnInit {
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

    constructor() { }

    ngOnInit(): void {}


}
