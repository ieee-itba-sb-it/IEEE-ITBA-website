import { Injectable } from '@angular/core';
import { userCollectionName} from '../../../secrets';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    collectionName = userCollectionName;

    constructor(private afs: Firestore) { }

    getCurrentUserRole(email: string): Promise<number> | number {
        const out: Promise<number> = new Promise((resolve, reject) => {
            getDoc(doc(this.afs, this.collectionName, email)).then(data => {
                const doc = data.data();
                // @ts-ignore
                return resolve(doc.role);
            });
        });

        return out;
    }
}
