import { Injectable } from '@angular/core';
import { IEEEuser } from '../../../shared/models/ieee-user/ieee-user';
import { BehaviorSubject, Observable } from 'rxjs';
import { userCollectionName} from '../../../secrets';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    collectionName = userCollectionName;

    constructor(private afs: AngularFirestore) { }

    getCurrentUserRole(email: string): Promise<number> | number {
        const out: Promise<number> = new Promise((resolve, reject) => {
            this.afs.collection(this.collectionName).doc(email).get().subscribe(data => {
                const doc = data.data();
                // @ts-ignore
                return resolve(doc.role);
            });
        });

        return out;
    }
}
