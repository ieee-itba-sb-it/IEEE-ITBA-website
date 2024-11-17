import {Component, OnInit} from '@angular/core';
import {SponsorsService} from 'src/app/core/services/sponsors/sponsors.service';
import {Sponsor} from '../../../../shared/models/sponsors';
import {Event, EventDate, EventStatus, IeeeEvent, sortedEventDates} from '../../../../shared/models/event/event';
import {EventService} from '../../../../core/services/event/event.service';
import {Timestamp} from '@angular/fire/firestore';
import {AppConfigService} from '../../../../core/services/configuration/app-config.service';
import {StaticSeoService} from "../../../../core/services/seo/seo-static.service";

@Component({
    selector: 'app-asimov-cup',
    templateUrl: './asimov-cup.component.html',
    styleUrls: ['./asimov-cup.component.css'],
})
export class AsimovCupComponent implements OnInit {
    sponsors: Sponsor[] = [];
    eventData?: Event;
    enrollOpen = false;
    enrollClosed = false;
    spectatorEnrollClosed = false;

    enrollLink = 'https://bit.ly/Asimov_Cup_Equipos';
    spectatorEnrollLink = 'https://bit.ly/Asimov_Cup_Espectadores';

    faq = [
        { q: 'ASIMOVCUP.FAQ.1.QUESTION', a: 'ASIMOVCUP.FAQ.1.ANSWER' },
        { q: 'ASIMOVCUP.FAQ.2.QUESTION', a: 'ASIMOVCUP.FAQ.2.ANSWER' },
        { q: 'ASIMOVCUP.FAQ.3.QUESTION', a: 'ASIMOVCUP.FAQ.3.ANSWER' },
        { q: 'ASIMOVCUP.FAQ.4.QUESTION', a: 'ASIMOVCUP.FAQ.4.ANSWER' },
        { q: 'ASIMOVCUP.FAQ.5.QUESTION', a: 'ASIMOVCUP.FAQ.5.ANSWER' }
    ];

    categories = [
        { textCode: 'ASIMOVCUP.CATEGORIES.SUMO.NAME',
            rulesLink: 'https://firebasestorage.googleapis.com/v0/b/ieeeitba.appspot.com/o/static%2FReglamento%20Sumo.pdf?alt=media&token=15542ea0-42ad-4df7-a098-361848b3cead',
            imgLink: '../../../../../assets/image/events/asimov-cup/sumo.svg',
            altTextCode: 'ASIMOVCUP.CATEGORIES.SUMO.IMAGE_ALT_TEXT',
            descriptionTextCode: 'ASIMOVCUP.CATEGORIES.SUMO.DESC'
        },
        { textCode: 'ASIMOVCUP.CATEGORIES.MINISUMO.NAME',
            rulesLink: 'https://firebasestorage.googleapis.com/v0/b/ieeeitba.appspot.com/o/static%2FReglamento%20Sumo.pdf?alt=media&token=15542ea0-42ad-4df7-a098-361848b3cead',
            imgLink: '../../../../../assets/image/events/asimov-cup/mini-sumo.svg',
            altTextCode: 'ASIMOVCUP.CATEGORIES.MINISUMO.IMAGE_ALT_TEXT',
            descriptionTextCode: 'ASIMOVCUP.CATEGORIES.MINISUMO.DESC'
        },
        { textCode: 'ASIMOVCUP.CATEGORIES.RACING.NAME',
            rulesLink: 'https://firebasestorage.googleapis.com/v0/b/ieeeitba.appspot.com/o/static%2FReglamento%20Carrera.pdf?alt=media&token=05ff1614-16a3-44df-93bb-4f9564720f4d',
            imgLink: '../../../../../assets/image/events/asimov-cup/racing.svg',
            altTextCode: 'ASIMOVCUP.CATEGORIES.RACING.IMAGE_ALT_TEXT',
            descriptionTextCode: 'ASIMOVCUP.CATEGORIES.RACING.DESC'
        },
        { textCode: 'ASIMOVCUP.CATEGORIES.FOOTBALL.NAME',
            rulesLink: 'https://firebasestorage.googleapis.com/v0/b/ieeeitba.appspot.com/o/static%2FReglamento%20Futbol.pdf?alt=media&token=bf0696c9-4302-453c-971b-531c86b3e185',
            imgLink: '../../../../../assets/image/events/asimov-cup/football.svg',
            altTextCode: 'ASIMOVCUP.CATEGORIES.FOOTBALL.IMAGE_ALT_TEXT',
            descriptionTextCode: 'ASIMOVCUP.CATEGORIES.FOOTBALL.DESC'
        }
    ];

    schedule = [
        'ASIMOVCUP.SCHEDULE.1',
        'ASIMOVCUP.SCHEDULE.2',
        'ASIMOVCUP.SCHEDULE.3',
        'ASIMOVCUP.SCHEDULE.4',
        'ASIMOVCUP.SCHEDULE.5',
        'ASIMOVCUP.SCHEDULE.6',
        'ASIMOVCUP.SCHEDULE.7',
        'ASIMOVCUP.SCHEDULE.8',
        'ASIMOVCUP.SCHEDULE.9',
        'ASIMOVCUP.SCHEDULE.10',
        'ASIMOVCUP.SCHEDULE.11',
        'ASIMOVCUP.SCHEDULE.12',
    ];

    // If no relevant events are happening, do not show section
    isShown(): boolean {
        if (!this.eventData) return false;
        return !!Object.keys(EventDate).find(key => this.eventData[key as EventDate].status !== EventStatus.UNSCHEDULED);
    }

    isOldDate(now: Timestamp, date: Date) {
        const oldDate = Timestamp.fromDate(new Date(date));
        return now > oldDate;
    }

    constructor(private sponsorsService: SponsorsService, private eventService: EventService, private appConfigService: AppConfigService, private seoService: StaticSeoService) {
        this.sponsors = sponsorsService.getAsimovSponsors();

        const now = Timestamp.now();
        this.enrollOpen = this.isOldDate(now, new Date('10 Jun 2023 03:00:00 UTC'));
        this.enrollClosed = this.isOldDate(now, new Date('27 Jul 2023 03:00:00 UTC'));
        this.spectatorEnrollClosed = this.isOldDate(now, new Date('27 Jul 2023 03:00:00 UTC'));
        scroll(0, 0);
    }

    enrollAvailable() {
        return this.enrollOpen && !this.enrollClosed;
    }

    spectatorEnrollAvailable() {
        return this.enrollOpen && !this.spectatorEnrollClosed;
    }

    ngOnInit(): void {
        this.seoService.updateMetaTags('ASIMOVCUP.PAGETITLE', 'ASIMOVCUP.PAGEDESCRIPTION', ['ASIMOVCUP', 'IEEE', 'ITBA'], 'events/asimov-cup/asimov-cup-logo.png');
        this.getAsimovCupEvent();
        // Set navbar color
        this.appConfigService.setAppColors({
            background: '#862633',
            underlying: '#C83D59FF',
            hover: '#9E4C67FF'
        });
    }

    getAsimovCupEvent(): void {
        this.eventService.getEvent(IeeeEvent.ASIMOV_CUP)
            .subscribe(event => this.eventData = event);
    }

    updateEventData(event: Event) {
        this.eventData = event;
    }

    getAppColors() {
        return this.appConfigService.getAppColors();
    }

    get eventDates(): EventDate[] {
        return sortedEventDates;
    }

    showEventDate(eventDate: EventDate): boolean {
        return this.eventData && this.eventData.dates[eventDate] && this.eventData.dates[eventDate].status !== EventStatus.UNSCHEDULED;
    }
}
