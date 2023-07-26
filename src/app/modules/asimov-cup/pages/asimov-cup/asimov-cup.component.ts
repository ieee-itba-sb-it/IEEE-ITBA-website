import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SponsorsService } from 'src/app/core/services/sponsors/sponsors.service';
import {Sponsor} from '../../../../shared/models/sponsors';
import {EventCardData} from '../../../../shared/models/event/event-card-data';
import {EventService} from '../../../../core/services/event/event.service';
import firebase from 'firebase/compat/app';
import Timestamp = firebase.firestore.Timestamp;
import { AppConfigService } from '../../../../core/services/configuration/app-config.service';

@Component({
  selector: 'app-asimov-cup',
  templateUrl: './asimov-cup.component.html',
  styleUrls: ['./asimov-cup.component.css'],
})
export class AsimovCupComponent implements OnInit {
  sponsors: Sponsor[] = [];
  eventData: EventCardData;
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
      rulesLink: 'https://lnr-argentina.com.ar/reglamentos/Reglamento%20Sumo%202023%20-%20Rev%200.pdf',
      imgLink: '../../../../../assets/image/events/asimov-cup/sumo.svg',
      altTextCode: 'ASIMOVCUP.CATEGORIES.SUMO.IMAGE_ALT_TEXT',
      descriptionTextCode: 'ASIMOVCUP.CATEGORIES.SUMO.DESC'
    },
    { textCode: 'ASIMOVCUP.CATEGORIES.MINISUMO.NAME',
      rulesLink: 'https://lnr-argentina.com.ar/reglamentos/Reglamento%20Sumo%202023%20-%20Rev%200.pdf',
      imgLink: '../../../../../assets/image/events/asimov-cup/mini-sumo.svg',
      altTextCode: 'ASIMOVCUP.CATEGORIES.MINISUMO.IMAGE_ALT_TEXT',
      descriptionTextCode: 'ASIMOVCUP.CATEGORIES.MINISUMO.DESC'
    },
    { textCode: 'ASIMOVCUP.CATEGORIES.RACING.NAME',
      rulesLink: 'https://lnr-argentina.com.ar/reglamentos/Reglamento%20Carrera%202023%20-%20Rev%200.pdf',
      imgLink: '../../../../../assets/image/events/asimov-cup/racing.svg',
      altTextCode: 'ASIMOVCUP.CATEGORIES.RACING.IMAGE_ALT_TEXT',
      descriptionTextCode: 'ASIMOVCUP.CATEGORIES.RACING.DESC'
    },
    { textCode: 'ASIMOVCUP.CATEGORIES.FOOTBALL.NAME',
      rulesLink: 'https://lnr-argentina.com.ar/reglamentos/Reglamento%20Futbol%202023%20-%20Rev%200.pdf',
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

  isOldDate(now: Timestamp, date: Date) {
    const oldDate = Timestamp.fromDate(new Date(date));
    return now > oldDate;
  }

  constructor(private sponsorsService: SponsorsService, private eventService: EventService, private appConfigService: AppConfigService) {
    this.sponsors = sponsorsService.getAsimovSponsors();
    this.eventData = this.eventService.getAsimovCupEvent();

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
    // Set navbar color
    this.appConfigService.setNavbarColor('#862633');
    this.appConfigService.setTitle('ASIMOVCUP.PAGETITLE');
  }
}
