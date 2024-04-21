import { Injectable } from '@angular/core';
import { CollectionReference, Firestore, Query, QueryConstraint, collection, endAt, endBefore, getCountFromServer, getDocs, limit, limitToLast, orderBy, query, startAfter, startAt, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { IEEEuser } from 'src/app/shared/models/ieee-user/ieee-user';
import { roles } from 'src/app/shared/models/roles/roles.enum';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  collectionName: string;
  collection: CollectionReference;

  constructor(private afs: Firestore) {}

  setCollectionName(collectionName: string) {
    this.collectionName = collectionName;
    this.collection = collection(this.afs, collectionName);
  }

  private getCount(query: Query): Observable<number> {
    return new Observable<number>(obs => {
      getCountFromServer(query).then(snap => {
        obs.next(snap.data().count);
      }).catch(err => {
        obs.error(err);
      }).finally(obs.complete);
    })
  }

  getTotalCount() {
    return this.getCount(query(this.collection))
  }

  getSearchCount(searchword: string) {
    let end: string = searchword.replace(/.$/, c => String.fromCharCode(c.charCodeAt(0) + 1));
    return this.getCount(query(this.collection, where('email', '>=', searchword), where('email', '<', end)))
  }

  private getUsersPage(query: Query): Observable<IEEEuser[]> {
    return new Observable<IEEEuser[]>(obs => {
      getDocs(query).then(data => {
        const ans: IEEEuser[] = [];
        for (const blogEntry in data.docs) {
            if (data.docs.hasOwnProperty(blogEntry)) {
                const doc: IEEEuser = data.docs[blogEntry].data() as IEEEuser;
                ans.push(doc);
            }
        }
        obs.next(ans);
      }).catch(err => {
        obs.error(err);
      }).finally(obs.complete);
    })
  }

  getUsersFirstPage(size: number, searchword?: string): Observable<IEEEuser[]> {
    let constraints: QueryConstraint[] = [limit(size), orderBy("email")];
    if (searchword) constraints.push(where('email', '>=', searchword), where('email', '<', searchword.replace(/.$/, c => String.fromCharCode(c.charCodeAt(0) + 1))));
    const q = query(this.collection, ...constraints);
    return this.getUsersPage(q);
  }

  getUsersNextPage(last: IEEEuser, size: number, searchword?: string) {
    let constraints: QueryConstraint[] = [limit(size), orderBy("email"), startAfter(last.email)];
    if (searchword) constraints.push(where('email', '>=', searchword), where('email', '<', searchword.replace(/.$/, c => String.fromCharCode(c.charCodeAt(0) + 1))));
    const q = query(this.collection, ...constraints);
    return this.getUsersPage(q);
  }

  getUsersPrevPage(first: IEEEuser, size: number, searchword?: string) {
    let constraints: QueryConstraint[] = [limitToLast(size), orderBy("email"), endBefore(first.email)];
    if (searchword) constraints.push(where('email', '>=', searchword), where('email', '<', searchword.replace(/.$/, c => String.fromCharCode(c.charCodeAt(0) + 1))));
    const q = query(this.collection, ...constraints);
    return this.getUsersPage(q);
  }

  addRole(userId: string, role: roles) {

  }

  removeRole(userId: string, role: roles) {

  }
}
