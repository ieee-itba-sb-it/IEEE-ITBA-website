import { Injectable } from '@angular/core';
import {EventCardData, IeeeEvent} from '../../../shared/models/event/event-card-data';
import {
    CollectionReference,
    Firestore,
    getDocs,
    query,
    Timestamp,
    collection,
    DocumentData,
    QueryDocumentSnapshot,
    where,
    Query,
    getDoc,
    doc,
    updateDoc
} from '@angular/fire/firestore';
import {eventsCollectionName} from "../../../secrets";
import {map, Observable, Subject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class EventService {
    private static readonly collectionName = eventsCollectionName;
    private readonly collection: CollectionReference;

    //   private ieeextreme: EventCardData = {
    //       routerLink: '/ieeextreme',
    //       imageSrc: '../../../../../assets/image/events/ieeextreme/ieee-extreme.jpg',
    //       imageAlt: 'Foto de competicion IEEExtreme',
    //       titleCode: 'HOME.IEEEXTREME.TITLE',
    //       descriptionCode: 'HOME.IEEEXTREME.TEXT',
    //       dates: [
    //           {
    //               showMonth: true,
    //               showYear: true,
    //               date: new Date(2024, 9, 1),
    //               descriptionCode: 'EVENTCARD.DATE.TBD'
    //           }
    //       ]
    //   };
    //
    //   private cursosPython: EventCardData = {
    //       routerLink: '/cursospython',
    //       imageSrc: '../../../../../assets/image/events/python-introductory/cursopython.jpg',
    //       imageAlt: 'Foto de los cursos de Python',
    //       titleCode: 'HOME.CLASSES.TITLE',
    //       descriptionCode: 'HOME.CLASSES.TEXT',
    //       dates: [
    //           {
    //               showMonth: true,
    //               showYear: true,
    //               date: new Date(2024, 4, 1),
    //               descriptionCode: 'EVENTCARD.DATE.TBD',
    //           }
    //       ]
    //   };
    //
    //   private bitcup: EventCardData = {
    //       routerLink: '/bitcup',
    //       imageSrc: '../../../../../assets/image/events/bitcup/bitcup-logo.jpeg',
    //       imageAlt: 'Foto de los cursos de Python',
    //       titleCode: 'HOME.BITCUP.TITLE',
    //       descriptionCode: 'HOME.BITCUP.TEXT',
    //       dates: []
    //   };
    //
    //   private dataAnalysis: EventCardData = {
    //       routerLink: '/data-analysis',
    //       imageSrc: '../../../../../assets/image/events/data-analysis/data-analysis-event.png',
    //       imageAlt: 'Foto de curso analisis de datos',
    //       titleCode: 'HOME.DATAANALYSIS.TITLE',
    //       descriptionCode: 'HOME.DATAANALYSIS.TEXT',
    //       dates: [
    //           {
    //               showMonth: true,
    //               showYear: true,
    //               date: new Date(2024, 8, 1),
    //               descriptionCode: '',
    //           }
    //       ]
    //   };
    //
    // private asimovCup: EventCardData = {
    //   routerLink: '/asimovcup',
    //   imageSrc: '../../../../../assets/image/events/asimov-cup/asimov-cup-logo.png',
    //   imageAlt: 'Logo de la Asimov Cup',
    //   titleCode: 'HOME.ASIMOVCUP.TITLE',
    //   descriptionCode: 'HOME.ASIMOVCUP.TEXT',
    //   dates: [
    //     {
    //         showMonth: true,
    //         showYear: true,
    //       date: new Date(2024, 7, 3),
    //       descriptionCode: ''
    //     }
    //   ]
    // };
    //
    //   private iotWorkshop: EventCardData = {
    //       routerLink: '/iot',
    //       imageSrc: '../../../../../assets/image/events/iot/iot-banner.jpeg',
    //       imageAlt: 'Logo de la Asimov Cup',
    //       titleCode: 'HOME.IOT.TITLE',
    //       descriptionCode: 'HOME.IOT.TEXT',
    //       dates: [{
    //           date: new Date(2023, 11, 1),
    //           descriptionCode: '',
    //       }]
    //   };
    //
    //   private typescript: EventCardData = {
    //       routerLink: '/curso-typescript',
    //       imageSrc: '../../../../../assets/image/events/typescript-course/banner.jpg',
    //       imageAlt: 'Foto de curso de Typescript',
    //       titleCode: 'TYPESCRIPT.TITLE',
    //       descriptionCode: 'TYPESCRIPT.DESCRIPTION.TEXT',
    //       dates: [{
    //           showMonth: true,
    //           showYear: true,
    //           date: new Date(2024, 5, 1),
    //           descriptionCode: '',
    //       }]
    //   };

    constructor(private afs: Firestore) {
        this.collection = collection(this.afs, EventService.collectionName);
    }

    private mapEventCardSnapshot(eventSnapshot: QueryDocumentSnapshot): EventCardData{
        const eventDoc = eventSnapshot.data();
        return {
            id: eventSnapshot.id as IeeeEvent,
            routerLink: eventDoc.routerLink,
            imageSrc: eventDoc.imageSrc,
            imageAlt: eventDoc.imageAlt,
            titleCode: eventDoc.titleCode,
            descriptionCode: eventDoc.descriptionCode,
            isRasEvent: eventDoc.isRasEvent,
            dates: eventDoc.dates.map((dateElem: DocumentData) => ({
                date: new Date(dateElem.date),
                descriptionCode: dateElem.descriptionCode,
                showMonth: dateElem.showMonth,
                showYear: dateElem.showYear
            }))
        };
    }

    private getEventsByQuery(query: Query, operation: string): Observable<EventCardData[]> {
        const call = new Subject<EventCardData[]>();
        getDocs(query).then((data =>
            data.docs.map(this.mapEventCardSnapshot)
        )).then((events) => {
            call.next(events);
        }).catch((error) => {
            console.error(`{operation} failed: ${error}`);
            call.next([])
        })
        return call.asObservable();
    }

    public getAllEvents(operation: string = "getAllEvents"): Observable<EventCardData[]> {
        return this.getEventsByQuery(query(this.collection), operation);
    }

    // getAllEvents(): EventCardData[] {
    //     return [this.ieeextreme,
    //         this.cursosPython,
    //         this.bitcup,
    //         this.dataAnalysis,
    //         this.asimovCup,
    //         this.iotWorkshop,
    //         this.typescript];
    // }

    public getUpcomingEvents(): Observable<EventCardData[]> {
        return this.getAllEvents("getUpcomingEvents").pipe(
            map((events: EventCardData[]) => events
                .filter((event) =>
                    event.dates.length > 0 && (event.dates[0].date == null ||
                    event.dates[0].date.getTime() >= Timestamp.now().toDate().getTime())
                )
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
                })
            )
        );
    }

    // getUpcomingEvents(): EventCardData[] {
    //     return this.getAllEvents()
    //         .filter((event) => event.dates.length > 0 && (event.dates[0].date == null || event.dates[0].date.getTime() >= Timestamp.now().toDate().getTime()))
    //         .sort((event1, event2) => {
    //             if (event1.dates.length !== event2.dates.length) {
    //                 return event2.dates.length - event1.dates.length;
    //             }
    //             const eventDate1 = event1.dates[0];
    //             const eventDate2 = event2.dates[0];
    //             if (eventDate1.date && eventDate2.date) {
    //                 if (eventDate1.showMonth && eventDate2.showMonth || !eventDate1.showMonth && !eventDate2.showMonth) {
    //                     return eventDate1.date.getTime() - eventDate2.date.getTime();
    //                 }
    //                 return eventDate1.showMonth ? 1 : -1;
    //             }
    //             return event1.dates[0].date ? -1 : 1;
    //         });
    // }

    getRasEvents(): Observable<EventCardData[]> {
        return this.getEventsByQuery(query(this.collection, where('isRasEvent', '==', true)), 'getRasEvents');
    }

    getAsimovCupEvent(): Observable<EventCardData> {
        const subject = new Subject<EventCardData>();
        getDoc(doc(this.afs, EventService.collectionName, IeeeEvent.ASIMOV_CUP)).then((data) => {
            subject.next(this.mapEventCardSnapshot(data));
        }).catch((error) => {
            console.error(`getAsimovCupEvent failed: ${error}`);
            subject.next(null);
        });
        return subject.asObservable();
    }

}
