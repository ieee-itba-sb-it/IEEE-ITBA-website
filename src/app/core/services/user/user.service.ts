import { Injectable } from '@angular/core';
import { userCollectionName} from '../../../secrets';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import {AuthService} from "../authorization/auth.service";
import {roles} from "../../../shared/models/roles/roles.enum";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    collectionName = userCollectionName;

    constructor(private afs: Firestore, private authService: AuthService) { }

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

    isCurrentUserAdmin(): Promise<boolean> {
        return new Promise((resolve) => {
            this.authService.getCurrentUser()
                .subscribe(async (user) => {
                    if (!user) {
                        resolve(false);
                    } else {
                        const userRole = user.role || await this.getCurrentUserRole(user.email);
                        resolve(userRole === roles.admin);
                    }
                });
        });
    }
}
