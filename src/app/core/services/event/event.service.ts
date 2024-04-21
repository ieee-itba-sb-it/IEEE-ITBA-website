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
import {AuthService} from "../authorization/auth.service";
import {UserService} from "../user/user.service";
import {roles} from "../../../shared/models/roles/roles.enum";

@Injectable({
    providedIn: 'root'
})
export class EventService {
    private static readonly collectionName = eventsCollectionName;
    private readonly collection: CollectionReference;

    constructor(private afs: Firestore, private authService: AuthService, private userService: UserService) {
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
                ...dateElem,
                date: new Date(dateElem.date)
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
            console.error(`${operation} failed: ${error}`);
            call.next([])
        })
        return call.asObservable();
    }

    public getAllEvents(operation: string = "getAllEvents"): Observable<EventCardData[]> {
        return this.getEventsByQuery(query(this.collection), operation);
    }

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

    getRasEvents(): Observable<EventCardData[]> {
        return this.getEventsByQuery(query(this.collection, where('isRasEvent', '==', true)), 'getRasEvents');
    }

    getEvent(eventId: IeeeEvent): Observable<EventCardData> {
        const subject = new Subject<EventCardData>();
        getDoc(doc(this.afs, EventService.collectionName, eventId)).then((data) => {
            subject.next(this.mapEventCardSnapshot(data));
        }).catch((error) => {
            console.error(`getEvent ${eventId} failed: ${error}`);
            subject.next(null);
        });
        return subject.asObservable();
    }

    private isCurrentUserAdmin(): Promise<boolean> {
        return new Promise((resolve) => {
            this.authService.getCurrentUser()
                .subscribe(async (user) => {
                    if (!user) {
                        resolve(false);
                    } else {
                        const userRole = user.role || await this.userService.getCurrentUserRole(user.email);
                        resolve(userRole === roles.admin);
                    }
                });
        });
    }

    private getIsoDate(date: Date): string {
        const isoTimeStamp = date.toISOString();
        return isoTimeStamp.split('T')[0];
    }

    async updateEvent(event: EventCardData): Promise<boolean> {
        if (!await this.isCurrentUserAdmin()) {
            console.error('updateEvent failed: user is not admin');
            return false;
        }
        try {
            await updateDoc(doc(this.afs, EventService.collectionName, event.id), {
                ...event,
                dates: event.dates.map((eventDate) => ({
                    ...eventDate,
                    date: this.getIsoDate(eventDate.date),
                }))
            });
            return true;
        } catch (error) {
            console.error(`updateEvent ${event.id} failed: ${error}`);
            return false;
        }
    }

}
