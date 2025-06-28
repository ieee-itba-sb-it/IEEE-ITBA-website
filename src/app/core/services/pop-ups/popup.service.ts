import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor(private firestore: Firestore) {}


  getEvents(): Observable<any[]> {
    const eventsCollection = collection(this.firestore, 'pop-ups');
    return collectionData(eventsCollection, { idField: 'id' }); 
  }
}
