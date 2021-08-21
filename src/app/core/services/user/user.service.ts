import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { IEEEuser } from '../../../shared/models/ieee-user/ieee-user';
import { BehaviorSubject, Observable } from 'rxjs';
import { userCollectionName} from '../../../secrets';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  collectionName = userCollectionName

  constructor(private afs: AngularFirestore) { }

  getCurrentUserRole(email: string) : Promise<number> | number {
    let out: Promise<number> = new Promise((resolve, reject) => {
      this.afs.collection(this.collectionName).doc(email).get().subscribe(data => {
        var doc = data.data();
        return resolve(doc.role);
      });
    })

    return out;
  }
}
