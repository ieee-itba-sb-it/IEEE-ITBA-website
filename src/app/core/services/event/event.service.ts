import {Injectable} from '@angular/core';
import {
    Event,
    EventDate,
    EventDoc,
    EventStatus,
    IeeeEvent,
    sortedEventDates
} from '../../../shared/models/event/event';
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
import {catchError, from, map, Observable, of} from "rxjs";
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
                    date: new Date(eventDoc.dates[date].date),
                    isPeriod: false
                }
                if (eventDoc.dates[date].lastDate) {
                    dates[date].lastDate = new Date(eventDoc.dates[date].lastDate);
                    dates[date].isPeriod = true;
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

    private static isEventDateUpcoming(eventDate: Event['dates'][EventDate]): boolean {
        const now = Timestamp.now().toDate();
        if (eventDate.status === EventStatus.CONFIRMED) {
            return eventDate.date >= now || (eventDate.isPeriod && eventDate.lastDate >= now);
        }
        if (eventDate.status === EventStatus.TENTATIVE) {
            return eventDate.month >= now.getUTCMonth();
        }
        if (eventDate.status === EventStatus.UPCOMING) {
            return eventDate.year >= now.getUTCFullYear();
        }
        return false;
    }

    private static getUpcomingEventDate(event: Event): EventDate | null {
        for (const eventDate of sortedEventDates) {
            if (EventService.isEventDateUpcoming(event.dates[eventDate])) {
                return eventDate;
            }
        }
        return null;
    }

    private static filterUpcomingEvents(event: Event): boolean {
        return EventService.getUpcomingEventDate(event) !== null;
    }

    private static getFakeDate(eventDate: Event['dates'][EventDate]): Date {
        if (eventDate.status === EventStatus.CONFIRMED) {
            const now = Timestamp.now().toDate();
            if (eventDate.isPeriod && eventDate.date < now) {
                return eventDate.lastDate;
            }
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
        const event1UpcomingDate = EventService.getUpcomingEventDate(event1);
        const event2UpcomingDate = EventService.getUpcomingEventDate(event2);
        if (event1UpcomingDate === null) {
            if (event2UpcomingDate === null) {
                return 0;
            }
            return -1;
        } else if (event2UpcomingDate === null) {
            return 1;
        }
        const event1Date = event1.dates[event1UpcomingDate];
        const event2Date = event2.dates[event2UpcomingDate];
        const event1FakeDate = EventService.getFakeDate(event1Date);
        const event2FakeDate = EventService.getFakeDate(event2Date);
        return event1FakeDate.getTime() - event2FakeDate.getTime();
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
                .pipe(map(() => true))
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
                    date: EventService.getIsoDate(event.dates[date].date),
                }
                if (event.dates[date].isPeriod) {
                    if (event.dates[date].lastDate === null) {
                        throw new Error(`updateEventDocDates failed: lastDate ${date} is null`);
                    }
                    if (event.dates[date].lastDate < event.dates[date].date) {
                        throw new Error(`updateEventDocDates failed: lastDate ${date} is before date`);
                    }
                    dates[date].lastDate = EventService.getIsoDate(event.dates[date].lastDate);
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
