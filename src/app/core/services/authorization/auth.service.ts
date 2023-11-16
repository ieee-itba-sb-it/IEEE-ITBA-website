import {Injectable} from '@angular/core';

import {Router} from '@angular/router';


import {BehaviorSubject, Observable} from 'rxjs';
import {createRegularUser} from '../../../shared/models/data-types';
import {IEEEuser} from '../../../shared/models/ieee-user/ieee-user';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Auth, User, UserCredential, createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword } from '@angular/fire/auth';

@Injectable({
    providedIn: 'root',
})

export class AuthService {

    // Vars
    user: User;
    accountObs: Observable<IEEEuser>;
    account: IEEEuser;

    // Constructor
    constructor(private firebaseAuth: Auth, private router: Router, private afs: Firestore) {
        this.user = firebaseAuth.currentUser
        // Seteamos observer
        firebaseAuth.onAuthStateChanged((usuario) => {
            if (usuario) {
                // Get user info from database
                const ans: BehaviorSubject<IEEEuser> = new BehaviorSubject(null);
                getDoc(doc(this.afs, 'users', usuario.email)).then(data => {
                    const doc = data.data() as IEEEuser;
                    ans.next(createRegularUser(doc.fname, doc.lname, doc.email, doc.photoURL, doc.uID));
                    this.accountObs = ans;
                })
            }
        });

    }

    // ---------------Methods---------------

    // Signup with email and password
    signup(email: string, password: string, fname: string, lname: string): Observable<UserCredential> {
        return new Observable((subscriber) => {
            createUserWithEmailAndPassword(this.firebaseAuth, email, password).then((crededential: UserCredential) => {
                this.account = createRegularUser(fname, lname, email, '', this.firebaseAuth.currentUser.uid);
                setDoc(doc(this.afs, 'users', email), this.account).then(res => {
                    subscriber.next(crededential);
                });
            }).catch(err => {
                subscriber.error(err);
            }).finally(subscriber.complete);
        });
    }

    // Login with email and password
    login(email: string, password: string): Observable<UserCredential> {
        return new Observable<UserCredential>(
            (subscriber) => {
                signInWithEmailAndPassword(this.firebaseAuth, email, password).then((credential: UserCredential) => {
                    subscriber.next(credential);
                }).catch (err => {
                    subscriber.error(err);
                }).finally(() => {
                    subscriber.complete();
                });
            }
        );
    }

    // Logout
    logout() {
        this.firebaseAuth.signOut();
    }

    // Check user state
    isUserLogued(){
    // this.user = this.firebaseAuth.currentUser;
        return !!this.user;
    }

    // Change password
    changePass(email: string, element: HTMLElement) {
        sendPasswordResetEmail(this.firebaseAuth, email).then((value => {
            element.textContent = 'Email Sent!';
            element.style.color = 'green';
        })).catch(err => {
            switch (err.code) {
                case 'auth/invalid-email': {
                    element.textContent = 'Invalid email address.';
                    element.style.color = 'red';
                    break;
                }
                case 'auth/user-not-found': {
                    element.textContent = 'No user corresponding to provided email.';
                    element.style.color = 'red';
                    break;
                }
                default: {
                    element.textContent = 'Error.';
                    element.style.color = 'red';
                    break;
                }
            }
        })
    }

    // -----------Info Getters-----------

    // Get user Name
    getCurrentUser(): Observable<IEEEuser> {
        return new Observable<IEEEuser>((subscriber) => {
            this.firebaseAuth.onAuthStateChanged((usuario) => {
                if (usuario){ // There is an user
                    getDoc(doc(this.afs, 'users', usuario.email)).then(data => {
                        const doc = data.data() as IEEEuser;
                        subscriber.next(createRegularUser(doc.fname, doc.lname, doc.email, doc.photoURL, doc.uID));
                    });
                } else {
                    subscriber.next(null);
                }
            });
        })
    }
}
