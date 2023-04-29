import { Injectable } from '@angular/core';
import { EventCardData } from '../../../shared/models/event/event-card-data';

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
        date: null,
        descriptionCode: 'EVENTCARD.DATE.TBD',
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
        date: null,
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
    dates: [
      {
        date: null,
        descriptionCode: 'EVENTCARD.DATE.TBD',
      }
    ]
  };

  private dataAnalysis: EventCardData = {
    routerLink: '/data-analysis',
    imageSrc: '../../../../../assets/image/events/data-analysis/data-analysis-event.png',
    imageAlt: 'Foto de curso analisis de datos',
    titleCode: 'HOME.DATAANALYSIS.TITLE',
    descriptionCode: 'HOME.DATAANALYSIS.TEXT',
    dates: [
      {
        date: null,
        descriptionCode: 'EVENTCARD.DATE.TBD',
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
        date: null,
        descriptionCode: 'EVENTCARD.DATE.TBD',
      }
    ]
  };

  private iotWorkshop: EventCardData = {
    routerLink: '/iot',
    imageSrc: '../../../../../assets/image/events/iot/iot-banner.jpeg',
    imageAlt: 'Logo de la Asimov Cup',
    titleCode: 'HOME.IOT.TITLE',
    descriptionCode: 'HOME.IOT.TEXT',
    dates: [
      {
        date: null,
        descriptionCode: 'EVENTCARD.DATE.TBD',
      }
    ]
  };

  constructor() { }

  getAllEvents(): EventCardData[] {
    return [ this.ieeextreme, this.cursosPython, this.bitcup, this.dataAnalysis, this.asimovCup, this.iotWorkshop];
  }

  getRasEvents(): EventCardData[] {
    return [ this.asimovCup ];
  }

}
