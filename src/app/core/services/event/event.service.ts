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
import {catchError, from, map, Observable, of, Subject} from "rxjs";
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
            } else if (eventDoc.dates[date].status === EventStatus.TENTATIVE) {
                dates[date] = {
                    status: EventStatus.TENTATIVE,
                    month: parseInt(eventDoc.dates[date].month, 10)
                }
            } else if (eventDoc.dates[date].status === EventStatus.UPCOMING) {
                dates[date] = {
                    status: EventStatus.UPCOMING,
                    year: parseInt(eventDoc.dates[date].year, 10)
                }
            } else {
                dates[date] = {
                    status: EventStatus.UNSCHEDULED
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
        return from(getDocs(query)).pipe(
            map((data) => data.docs.map(EventService.mapEventDoc)),
            catchError((err) => {
                console.error(`${operation} failed: ${err}`);
                return of([]);
            })
        );
    }

    public getAllEvents(operation: string = "getAllEvents"): Observable<Event[]> {
        return this.getEventsByQuery(query(this.collection), operation);
    }

    private static filterUpcomingEvents(event: Event): boolean {
        const now = Timestamp.now().toDate();
        const openingDate = event.dates[EventDate.OPENING];
        if (openingDate.status === EventStatus.UNSCHEDULED) {
            return false;
        }
        if (openingDate.status === EventStatus.UPCOMING) {
            return openingDate.year >= now.getUTCFullYear();
        }
        if (openingDate.status === EventStatus.TENTATIVE) {
            return openingDate.month >= now.getUTCMonth();
        }
        if (openingDate.status === EventStatus.CONFIRMED) {
            return openingDate.date >= now;
        }
    }

    private static getFakeDate(eventDate: Event['dates'][EventDate]): Date {
        if (eventDate.status === EventStatus.CONFIRMED) {
            return eventDate.date;
        }
        if (eventDate.status === EventStatus.TENTATIVE) {
            // The last day of the month
            const today = new Date();
            return new Date(Date.UTC(today.getUTCFullYear(), eventDate.month + 1, 0));
        }
        if (eventDate.status === EventStatus.UPCOMING) {
            // The last day of the year
            return new Date(eventDate.year, 11, 31);
        }
        return null;
    }

    private static sortEvents(event1: Event, event2: Event): number {
        const event1OpeningDate = event1.dates[EventDate.OPENING];
        const event2OpeningDate = event2.dates[EventDate.OPENING];
        if (event1OpeningDate.status === EventStatus.UNSCHEDULED) {
            if (event2OpeningDate.status === EventStatus.UNSCHEDULED) {
                return 0;
            }
            return -1;
        } else if (event2OpeningDate.status === EventStatus.UNSCHEDULED) {
            return 1;
        }
        const fakeEvent1Date = EventService.getFakeDate(event1OpeningDate);
        const fakeEvent2Date = EventService.getFakeDate(event2OpeningDate);
        return fakeEvent1Date.getTime() - fakeEvent2Date.getTime();
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

    getEvent(eventId: IeeeEvent): Observable<Event | null> {
        return from(getDoc(doc(this.afs, EventService.collectionName, eventId)))
            .pipe(map((data: QueryDocumentSnapshot<EventDoc>) => EventService.mapEventDoc(data)))
            .pipe(catchError((err) => {
                console.error(`getEvent ${eventId} failed: ${err}`);
                return of(null);
            }));
    }

    updateEvent(event: Event): Observable<boolean> {
        return this.userService.isCurrentUserAdmin().pipe((isAdmin) => {
            if (!isAdmin) {
                console.error('updateEvent failed: user is not admin');
                return of(false);
            }
            const eventDoc = EventService.mapEvent(event);
            return from(updateDoc(doc(this.afs, EventService.collectionName, event.id), eventDoc))
                .pipe(() => of(true))
                .pipe(catchError((error) => {
                    console.error(`updateEvent ${event.id} failed: ${error}`);
                    return of(false)
                }));
        })
    }

    private static getIsoDate(date: Date): string {
        const isoTimeStamp = date.toISOString();
        return isoTimeStamp.split('T')[0];
    }

    private static mapEventDates(event: Event): EventDoc['dates'] {
        const now = Timestamp.now().toDate();
        const dates: EventDoc['dates'] = {} as EventDoc['dates'];
        for (const date in event.dates) {
            if (event.dates[date].status === EventStatus.CONFIRMED) {
                const today = new Date(this.getIsoDate(now));
                if (event.dates[date].date === null) {
                    throw new Error(`updateEventDocDates failed: date ${date} is null`);
                }
                if (event.dates[date].date < today) {
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
                if (event.dates[date].month < now.getUTCMonth()) {
                    throw new Error(`updateEventDocDates failed: month ${event.dates[date].month} is in the past`);
                }
                dates[date] = {
                    status: EventStatus.TENTATIVE,
                    month: event.dates[date].month
                }
            } else if (event.dates[date].status === EventStatus.UPCOMING) {
                if (event.dates[date].year === null) {
                    throw new Error(`updateEventDocDates failed: year ${date} is null`);
                }
                if (event.dates[date].year < now.getUTCFullYear()) {
                    throw new Error(`updateEventDocDates failed: year ${event.dates[date].year} is in the past`);
                }
                dates[date] = {
                    status: EventStatus.UPCOMING,
                    year: event.dates[date].year
                }
            } else {
                dates[date] = {
                    status: EventStatus.UNSCHEDULED
                }
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



}
