import {Injectable} from '@angular/core';

import {Router} from '@angular/router';


import { Observable, ReplaySubject } from 'rxjs';
import {createRegularUser} from '../../../shared/models/data-types';
import {IEEEuser} from '../../../shared/models/ieee-user/ieee-user';
import { DatabaseErrors } from '../../../shared/models/errors/database';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Auth, User, UserCredential, createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, OAuthCredential, AuthErrorCodes, updateProfile } from '@angular/fire/auth';
import { roles } from 'src/app/shared/models/roles/roles.enum';

@Injectable({
    providedIn: 'root',
})

export class AuthService {
    // Vars
    user: User;
    credential: UserCredential;
    accountObs: ReplaySubject<IEEEuser | null>;
    account: IEEEuser;

    // OAuth
    googleProvider: GoogleAuthProvider;

    // Constructor
    constructor(private firebaseAuth: Auth, private router: Router, private afs: Firestore) {
        this.googleProvider = new GoogleAuthProvider();
        this.user = firebaseAuth.currentUser
        // Seteamos observer
        this.accountObs = new ReplaySubject(1);
        onAuthStateChanged(this.firebaseAuth, (usuario) => {
            if (usuario){
                this.user = usuario;
                getDoc(doc(this.afs, 'users', usuario.email)).then(data => {
                    const userData = data.data() as IEEEuser;
                    this.account = createRegularUser(userData.fname, userData.lname, userData.email, userData.photoURL, userData.role, userData.uID);
                    this.accountObs.next(this.account);
                }).catch(err => {
                    // Caso en el que no exista el usuario en la base de datos (por ejemplo, si acaba de registrarse con google)
                    if (err.code === DatabaseErrors.UNAUTHORIZED) {
                        // Espera a que, en caso de acabar de registrarse con mail, se cree el usuario en la base de datos
                        const sub = this.accountObs.subscribe((data) => {
                            let displayName = usuario.displayName;
                            if (!displayName) displayName = usuario.email.split("@")[0];
                            let fname = displayName.split(" ")[0];
                            let lname = displayName.split(" ");
                            lname.shift();
                            this.account = createRegularUser(fname, lname.join(" ") || "", usuario.email, usuario.photoURL, roles.regularUser, usuario.uid);
                            setDoc(doc(this.afs, 'users', usuario.email), this.account).then(res => {
                                this.accountObs.next(this.account);
                                sub.unsubscribe();
                            });
                        });
                    }
                    else {
                        this.logout();
                        this.accountObs.next(null);
                    }
                });
            } else {
                this.accountObs.next(null);
            }
        });

    }

    // ---------------Methods---------------

    // Signup with email and password
    signup(email: string, password: string, fname: string, lname: string): Observable<UserCredential> {
        return new Observable((subscriber) => {
            this.accountObs.next(null);
            createUserWithEmailAndPassword(this.firebaseAuth, email, password).then((crededential: UserCredential) => {
                this.account = createRegularUser(fname, lname, email, null, roles.regularUser, this.firebaseAuth.currentUser.uid);
                setDoc(doc(this.afs, 'users', email), this.account).then(res => {
                    updateProfile(this.firebaseAuth.currentUser, {displayName: `${fname} ${lname}`});
                    this.accountObs.next(this.account);
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

    googleLogin(): Observable<OAuthCredential> { 
        return new Observable<OAuthCredential>(
            (subscriber) => {
                signInWithPopup(this.firebaseAuth, this.googleProvider).then((result) => {
                    const credential = GoogleAuthProvider.credentialFromResult(result);
                    this.credential = result
                    subscriber.next(credential);
                }).catch (err => {
                    console.log(err.code);
                    
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
        this.accountObs.next(null);
    }

    // Check user state
    isUserLogued(){
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
    getCurrentUser(): Observable<IEEEuser | null> {
        return this.accountObs.asObservable();
    }
}
