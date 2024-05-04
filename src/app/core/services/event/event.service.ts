import {Injectable} from '@angular/core';
import {Event, EventDate, EventDoc, EventStatus, IeeeEvent} from '../../../shared/models/event/event';
import {
    collection,
    CollectionReference,
    doc,
    Firestore,
    getDoc,
    getDocs,
    query,
    Query,
    QueryDocumentSnapshot,
    Timestamp,
    updateDoc,
    where
} from '@angular/fire/firestore';
import {eventsCollectionName} from "../../../secrets";
import {map, Observable, Subject} from "rxjs";
import {UserService} from "../user/user.service";

@Injectable({
    providedIn: 'root'
})
export class EventService {
    private static readonly collectionName = eventsCollectionName;
    private readonly collection: CollectionReference;

    constructor(private afs: Firestore, private userService: UserService) {
        this.collection = collection(this.afs, EventService.collectionName);
    }

    private static mapEventDocDates(eventDoc: EventDoc): Event['dates'] {
        const dates: Event['dates'] = {} as Event['dates'];
        for (const date in eventDoc.dates) {
            if (eventDoc.dates[date].status === EventStatus.CONFIRMED) {
                dates[date] = {
                    status: EventStatus.CONFIRMED,
                    date: new Date(eventDoc.dates[date].date)
                }
            } else {
                dates[date] = {
                    ...eventDoc.dates[date]
                }
            }
        }
        return dates;
    }

    private static mapEventDoc(eventSnapshot: QueryDocumentSnapshot<EventDoc>): Event {
        const eventDoc: EventDoc = eventSnapshot.data();
        return {
            ...eventDoc,
            id: eventSnapshot.id as IeeeEvent,
            dates: EventService.mapEventDocDates(eventDoc)
        };
    }

    private getEventsByQuery(query: Query, operation: string): Observable<Event[]> {
        const call = new Subject<Event[]>();
        getDocs(query).then((data =>
            data.docs.map(EventService.mapEventDoc)
        )).then((events) => {
            call.next(events);
        }).catch((error) => {
            console.error(`${operation} failed: ${error}`);
            call.next([])
        })
        return call.asObservable();
    }

    public getAllEvents(operation: string = "getAllEvents"): Observable<Event[]> {
        return this.getEventsByQuery(query(this.collection), operation);
    }

    private static filterUpcomingEvents(event: Event): boolean {
        const now = Timestamp.now().toDate();
        const inscriptionDate = event.dates[EventDate.INSCRIPTION];
        if (inscriptionDate.status === EventStatus.UNSCHEDULED) {
            return false;
        }
        if (inscriptionDate.status === EventStatus.UPCOMING) {
            return inscriptionDate.year >= now.getFullYear();
        }
        if (inscriptionDate.status === EventStatus.TENTATIVE) {
            return inscriptionDate.month >= now.getMonth();
        }
        if (inscriptionDate.status === EventStatus.CONFIRMED) {
            return inscriptionDate.date >= now;
        }
    }

    private static sortEvents(event1: Event, event2: Event): number {
        const event1InscriptionDate = event1.dates[EventDate.INSCRIPTION];
        const event2InscriptionDate = event2.dates[EventDate.INSCRIPTION];
        if (event1InscriptionDate.status === EventStatus.CONFIRMED && event2InscriptionDate.status !== EventStatus.CONFIRMED) {
            return -1;
        }
        if (event1InscriptionDate.status !== EventStatus.CONFIRMED && event2InscriptionDate.status === EventStatus.CONFIRMED) {
            return 1;
        }
        if (event1InscriptionDate.status === EventStatus.CONFIRMED && event2InscriptionDate.status === EventStatus.CONFIRMED) {
            return event1InscriptionDate.date.getTime() - event2InscriptionDate.date.getTime();
        }
        if (event1InscriptionDate.status === EventStatus.TENTATIVE && event2InscriptionDate.status !== EventStatus.TENTATIVE) {
            return -1;
        }
        if (event1InscriptionDate.status !== EventStatus.TENTATIVE && event2InscriptionDate.status === EventStatus.TENTATIVE) {
            return 1;
        }
        if (event1InscriptionDate.status === EventStatus.TENTATIVE && event2InscriptionDate.status === EventStatus.TENTATIVE) {
            return event1InscriptionDate.month - event2InscriptionDate.month;
        }
        if (event1InscriptionDate.status === EventStatus.UPCOMING && event2InscriptionDate.status !== EventStatus.UPCOMING) {
            return -1;
        }
        if (event1InscriptionDate.status !== EventStatus.UPCOMING && event2InscriptionDate.status === EventStatus.UPCOMING) {
            return 1;
        }
        if (event1InscriptionDate.status === EventStatus.UPCOMING && event2InscriptionDate.status === EventStatus.UPCOMING) {
            return event1InscriptionDate.year - event2InscriptionDate.year;
        }
        return 0;
    }

    public getUpcomingEvents(): Observable<Event[]> {
        return this.getAllEvents("getUpcomingEvents").pipe(
            map((events: Event[]) => events
                .filter(EventService.filterUpcomingEvents)
                .sort(EventService.sortEvents)
            )
        );
    }

    getRasEvents(): Observable<Event[]> {
        return this.getEventsByQuery(query(this.collection, where('isRasEvent', '==', true)), 'getRasEvents');
    }

    getEvent(eventId: IeeeEvent): Observable<Event> {
        const subject = new Subject<Event>();
        getDoc(doc(this.afs, EventService.collectionName, eventId)).then((data: QueryDocumentSnapshot<EventDoc>) => {
            subject.next(EventService.mapEventDoc(data));
        }).catch((error) => {
            console.error(`getEvent ${eventId} failed: ${error}`);
            subject.next(null);
        });
        return subject.asObservable();
    }

    private static getIsoDate(date: Date): `${number}-${number}-${number}` {
        const isoTimeStamp = date.toISOString();
        return isoTimeStamp.split('T')[0] as `${number}-${number}-${number}`;
    }

    private static mapEventDates(event: Event): EventDoc['dates'] {
        const now = Timestamp.now().toDate();
        const dates: EventDoc['dates'] = {} as EventDoc['dates'];
        for (const date in event.dates) {
            if (event.dates[date].status === EventStatus.CONFIRMED) {
                if (event.dates[date].date === null) {
                    throw new Error(`updateEventDocDates failed: date ${date} is null`);
                }
                if (event.dates[date].date < now) {
                    throw new Error(`updateEventDocDates failed: date ${date} is in the past`);
                }
                dates[date] = {
                    status: EventStatus.CONFIRMED,
                    date: EventService.getIsoDate(event.dates[date].date)
                }
            } else if (event.dates[date].status === EventStatus.TENTATIVE) {
                if (event.dates[date].month === null) {
                    throw new Error(`updateEventDocDates failed: month ${date} is null`);
                }
                if (event.dates[date].month > 11) {
                    throw new Error(`updateEventDocDates failed: month ${event.dates[date].month} is invalid`);
                }
                if (event.dates[date].month < now.getMonth()) {
                    throw new Error(`updateEventDocDates failed: month ${event.dates[date].month} is in the past`);
                }
            } else if (event.dates[date].status === EventStatus.UPCOMING) {
                if (event.dates[date].year === null) {
                    throw new Error(`updateEventDocDates failed: year ${date} is null`);
                }
                if (event.dates[date].year < now.getFullYear()) {
                    throw new Error(`updateEventDocDates failed: year ${event.dates[date].year} is in the past`);
                }
            }
            dates[date] = {
                ...event.dates[date]
            }
        }
        return dates;
    }

    private static mapEvent(event: Event): EventDoc {
        const dates = EventService.mapEventDates(event);
        return {
            ...event,
            dates
        }
    }

    async updateEvent(event: Event): Promise<boolean> {
        if (!await this.userService.isCurrentUserAdmin()) {
            console.error('updateEvent failed: user is not admin');
            return false;
        }
        try {
            const eventDoc = EventService.mapEvent(event);
            await updateDoc(doc(this.afs, EventService.collectionName, event.id), eventDoc);
            return true;
        } catch (error) {
            console.error(`updateEvent ${event.id} failed: ${error}`);
            return false;
        }
    }

}
