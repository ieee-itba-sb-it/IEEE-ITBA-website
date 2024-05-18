import { Injectable } from '@angular/core';
import { userCollectionName} from '../../../secrets';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import {AuthService} from "../authorization/auth.service";
import {roles} from "../../../shared/models/roles/roles.enum";
import {map, Observable} from "rxjs";
import {IEEEuser} from "../../../shared/models/ieee-user/ieee-user";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    collectionName = userCollectionName;

    constructor(private afs: Firestore, private authService: AuthService) { }

    // Cold observable, returns role of that specific user
    getCurrentUserRole(email: string): Observable<roles> {
        return new Observable<roles>((observer) => {
            getDoc(doc(this.afs, this.collectionName, email)).then(data => {
                const doc = data.data() as IEEEuser;
                observer.next(doc.role);
                observer.complete();
            });
        });
    }

    isCurrentUserAdmin(): Observable<boolean> {
        return this.authService.getCurrentUser().pipe(map((user) => user !== null && user.role === roles.admin));
    }
}
