import { Injectable } from '@angular/core';
import { EventCardData } from '../../../shared/models/event/event-card-data';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})

export class EventService {

  private ieeextreme: EventCardData = {
    routerLink: '/ieeextreme',
    imageSrc: '../../../../../assets/image/events/ieeextreme/ieee-extreme.jpg',
    imageAlt: 'Foto de competicion IEEExtreme',
    titleCode: 'HOME.IEEEXTREME.TITLE',
    descriptionCode: 'HOME.IEEEXTREME.TEXT',
    dates: [
      {
        date: new Date(2023, 9, 28),
        descriptionCode: 'EVENTCARD.DATE.TBD'
      }
    ]
  };

  private cursosPython: EventCardData = {
    routerLink: '/cursospython',
    imageSrc: '../../../../../assets/image/events/python-introductory/cursopython.jpg',
    imageAlt: 'Foto de los cursos de Python',
    titleCode: 'HOME.CLASSES.TITLE',
    descriptionCode: 'HOME.CLASSES.TEXT',
    dates: [
      {
        date: new Date(2023, 7, 7),
        descriptionCode: 'EVENTCARD.DATE.TBD',
      }
    ]
  };

  private bitcup: EventCardData = {
    routerLink: '/bitcup',
    imageSrc: '../../../../../assets/image/events/bitcup/bitcup-logo.jpeg',
    imageAlt: 'Foto de los cursos de Python',
    titleCode: 'HOME.BITCUP.TITLE',
    descriptionCode: 'HOME.BITCUP.TEXT',
    dates: []
  };

  private dataAnalysis: EventCardData = {
    routerLink: '/data-analysis',
    imageSrc: '../../../../../assets/image/events/data-analysis/data-analysis-event.png',
    imageAlt: 'Foto de curso analisis de datos',
    titleCode: 'HOME.DATAANALYSIS.TITLE',
    descriptionCode: 'HOME.DATAANALYSIS.TEXT',
    dates: [
      {
        date: new Date(2023, 8, 18),
        descriptionCode: '',
      }
    ]
  };

  private asimovCup: EventCardData = {
    routerLink: '/asimovcup',
    imageSrc: '../../../../../assets/image/events/asimov-cup/asimov-cup-logo.png',
    imageAlt: 'Logo de la Asimov Cup',
    titleCode: 'HOME.ASIMOVCUP.TITLE',
    descriptionCode: 'HOME.ASIMOVCUP.TEXT',
    dates: [
      {
        date: new Date(2023, 6, 29),
        descriptionCode: ''
      }
    ]
  };

  private iotWorkshop: EventCardData = {
    routerLink: '/iot',
    imageSrc: '../../../../../assets/image/events/iot/iot-banner.jpeg',
    imageAlt: 'Logo de la Asimov Cup',
    titleCode: 'HOME.IOT.TITLE',
    descriptionCode: 'HOME.IOT.TEXT',
    dates: []
  };

  private typescript: EventCardData = {
    routerLink: '/curso-typescript',
    imageSrc: '../../../../../assets/image/events/typescript-course/banner.jpg',
    imageAlt: 'Foto de curso de Typescript',
    titleCode: 'TYPESCRIPT.TITLE',
    descriptionCode: 'TYPESCRIPT.DESCRIPTION.TEXT',
    dates: [{
      date: new Date(2023, 4, 31),
      descriptionCode: '',
    }]
  };

  constructor() { }

  getAllEvents(): EventCardData[] {
    return [this.ieeextreme,
      this.cursosPython,
      this.bitcup,
      this.dataAnalysis,
      this.asimovCup,
      this.iotWorkshop,
      this.typescript];
  }

  getUpcomingEvents(): EventCardData[] {
    return this.getAllEvents()
      .filter((event) => event.dates.length > 0 && (event.dates[0].date == null || event.dates[0].date.getTime() >= firebase.firestore.Timestamp.now().toDate().getTime()))
      .sort((event1, event2) => {
      if (event1.dates.length !== event2.dates.length) {
        return event2.dates.length - event1.dates.length;
      }
      const eventDate1 = event1.dates[0];
      const eventDate2 = event2.dates[0];
      if (eventDate1.date && eventDate2.date) {
        if (eventDate1.showMonth && eventDate2.showMonth || !eventDate1.showMonth && !eventDate2.showMonth) {
          return eventDate1.date.getTime() - eventDate2.date.getTime();
        }
        return eventDate1.showMonth ? 1 : -1;
      }
      return event1.dates[0].date ? -1 : 1;
    });
  }

  getRasEvents(): EventCardData[] {
    return [ this.asimovCup ];
  }

  getAsimovCupEvent(): EventCardData {
    return this.asimovCup;
  }

}
