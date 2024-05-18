import { Injectable } from '@angular/core';
import { CollectionReference, Firestore, Query, QueryConstraint, collection, doc, endBefore, getCountFromServer, getDocs, limit, limitToLast, orderBy, query, startAfter, startAt, where, writeBatch } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { IEEEuser } from 'src/app/shared/models/ieee-user/ieee-user';
import { IEEEUserFilters } from 'src/app/shared/models/ieee-user/ieee-user-filters';

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
      }).finally(() => {
        obs.complete();
      });
    })
  }

  getTotalCount(filters?: IEEEUserFilters) {
    let constraints: QueryConstraint[] = [];
    if (filters?.email) {
      let end: string = filters.email.replace(/.$/, c => String.fromCharCode(c.charCodeAt(0) + 1));
      constraints.push(where('email', '>=', filters.email), where('email', '<', end));
    }
    if (filters?.role) constraints.push(where('role', '==', filters.role));
    return this.getCount(query(this.collection, ...constraints));
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
      }).finally(() => {
        obs.complete();
      });
    })
  }

  getUsersFirstPage(size: number, filters?: IEEEUserFilters): Observable<IEEEuser[]> {
    let constraints: QueryConstraint[] = [limit(size), orderBy("email")];
    if (filters?.email) constraints.push(where('email', '>=', filters.email), where('email', '<', filters.email.replace(/.$/, c => String.fromCharCode(c.charCodeAt(0) + 1))));
    if (filters?.role) constraints.push(where('role', 'in', filters.role));
    const q = query(this.collection, ...constraints);
    return this.getUsersPage(q);
  }

  getUsersNextPage(last: IEEEuser, size: number, filters?: IEEEUserFilters) {
    let constraints: QueryConstraint[] = [limit(size), orderBy("email"), startAfter(last.email)];
    if (filters?.email) constraints.push(where('email', '>=', filters.email), where('email', '<', filters.email.replace(/.$/, c => String.fromCharCode(c.charCodeAt(0) + 1))));
    if (filters?.role) constraints.push(where('role', 'in', filters.role));
    const q = query(this.collection, ...constraints);
    return this.getUsersPage(q);
  }

  getUsersPrevPage(first: IEEEuser, size: number, filters?: IEEEUserFilters) {
    let constraints: QueryConstraint[] = [limitToLast(size), orderBy("email"), endBefore(first.email)];
    if (filters?.email) constraints.push(where('email', '>=', filters.email), where('email', '<', filters.email.replace(/.$/, c => String.fromCharCode(c.charCodeAt(0) + 1))));
    if (filters?.role) constraints.push(where('role', 'in', filters.role));
    const q = query(this.collection, ...constraints);
    return this.getUsersPage(q);
  }

  refreshUserPage(first: IEEEuser, size: number, filters?: IEEEUserFilters) {
    let constraints: QueryConstraint[] = [limit(size), orderBy("email"), startAt(first.email)];
    if (filters?.email) constraints.push(where('email', '>=', filters.email), where('email', '<', filters.email.replace(/.$/, c => String.fromCharCode(c.charCodeAt(0) + 1))));
    if (filters?.role) constraints.push(where('role', 'in', filters.role));
    const q = query(this.collection, ...constraints);
    return this.getUsersPage(q);
  }

  updateUser(user: IEEEuser, updateRole: boolean): Observable<IEEEuser> {
    const roleDocument = { role: user.role };
    return new Observable(obs => {
      const batch = writeBatch(this.afs);
      batch.set(doc(this.afs, "users", user.email), user);
      if (updateRole) batch.set(doc(this.afs, "sensitive-user-data", user.email), roleDocument);
      batch.commit().then(res => {
        obs.next(user);
      }).catch(err => {
        obs.error(err);
      }).finally(() => {
        obs.complete();
      });
    })
  }
}
