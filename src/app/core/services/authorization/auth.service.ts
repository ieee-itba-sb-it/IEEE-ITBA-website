import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { createRegularUser } from '../../../shared/models/data-types';
import { IEEEuser } from '../../../shared/models/ieee-user/ieee-user';
import {
    Firestore,
    FirestoreError,
    deleteDoc,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    writeBatch, collectionGroup, runTransaction, query, where, getDocs
} from '@angular/fire/firestore';
import {
    Auth,
    User,
    UserCredential,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    OAuthCredential,
    updateProfile,
    sendEmailVerification,
    AuthErrorCodes,
    AuthError,
    ActionCodeSettings,
    getIdToken, signInWithCustomToken
} from '@angular/fire/auth';
import {ref, uploadBytes, Storage, getDownloadURL, deleteObject} from '@angular/fire/storage';
import {get} from "@angular/fire/database";
import {getAll} from "@angular/fire/remote-config";
import {IEEEMember} from "../../../shared/models/team-member";

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
    constructor(private firebaseAuth: Auth, private firebaseStorage: Storage, private afs: Firestore) {
        this.googleProvider = new GoogleAuthProvider();
        this.user = firebaseAuth.currentUser;
        // Seteamos observer
        this.accountObs = new ReplaySubject(1);

        onAuthStateChanged(this.firebaseAuth, (usuario) => {
            if (usuario){
                this.user = usuario;
                getDoc(doc(this.afs, 'users', usuario.email)).then(data => {
                    const userData = data.data() as IEEEuser;
                    this.account = createRegularUser(userData.fullname, userData.email, userData.photoURL, userData.roles, userData.uID, usuario.emailVerified, userData.linkedin);
                    this.accountObs.next(this.account);
                }).catch((err: FirestoreError) => {
                    // Caso en el que no exista el usuario en la base de datos (por ejemplo, si acaba de registrarse con google)
                    if (err.code == "permission-denied") this.createUserDoc(usuario).subscribe();
                    else this.logout();
                });
            } else {
                this.account = null;
                this.accountObs.next(null);
            }
        });
    }

    // ---------------Methods---------------

    // Signup with email and password
    signup(email: string, password: string, fullname: string): Observable<UserCredential> {
        return new Observable((subscriber) => {
            this.accountObs.next(null);
            createUserWithEmailAndPassword(this.firebaseAuth, email, password)
                .then((crededential: UserCredential) => {
                    this.account = createRegularUser(fullname, email, null, [], this.firebaseAuth.currentUser.uid);
                    updateProfile(this.firebaseAuth.currentUser, {displayName: fullname});
                    this.accountObs.next(this.account);
                    subscriber.next(crededential);
                })
                .catch((err: AuthError) => subscriber.error(err))
                .finally(() => subscriber.complete());
        });
    }

    // Login with email and password
    login(email: string, password: string): Observable<UserCredential> {
        return new Observable<UserCredential>(
            (subscriber) => {
                signInWithEmailAndPassword(this.firebaseAuth, email, password)
                    .then((credential: UserCredential) => subscriber.next(credential))
                    .catch((err: AuthError) => subscriber.error(err))
                    .finally(() => subscriber.complete());
            }
        );
    }

    googleLogin(): Observable<OAuthCredential> {
        return new Observable<OAuthCredential>(
            (subscriber) => {
                signInWithPopup(this.firebaseAuth, this.googleProvider)
                    .then((result) => {
                        const credential = GoogleAuthProvider.credentialFromResult(result);
                        this.credential = result;
                        subscriber.next(credential);
                    })
                    .catch((err: AuthError) => subscriber.error(err))
                    .finally(() => subscriber.complete());
            }
        );
    }

    createUserDoc(user: User): Observable<boolean> {
        return new Observable<boolean>((subscriber) => {
            let displayName = user.displayName;
            if (!displayName) displayName = user.email.split("@")[0];
            this.account = createRegularUser(displayName, user.email, user.photoURL, [], user.uid, user.emailVerified);
            setDoc(doc(this.afs, 'users', user.email), this.account)
                .then(res => this.accountObs.next(this.account))
                .catch((err: FirestoreError) => subscriber.error(err))
                .finally(() => subscriber.complete());
        });
    }

    // Logout
    logout() {
        this.firebaseAuth.signOut();
        this.account = null;
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

    updateProfile(newUser: IEEEuser): Observable<boolean> {
        return new Observable<boolean>((subscriber) => {
            let data = { ...newUser };
            updateProfile(this.firebaseAuth.currentUser, {displayName: newUser.fullname})
                .then(() => updateDoc(doc(this.afs, 'users', newUser.email), data))
                .then(() => {
                    this.account = newUser;
                    this.accountObs.next(this.account);
                    subscriber.next(true);
                })
                .catch((err: AuthError | FirestoreError) => subscriber.error(err))
                .finally(() => subscriber.complete());
        });
    }

    updateProfilePic(imageurl: string, extension: string): Observable<string> {
        return new Observable<string>((subscriber) => {
            if (!this.account)
                return subscriber.error(AuthErrorCodes.USER_SIGNED_OUT);
            if (!imageurl || imageurl.trim() == "" || !extension) {
                deleteObject(ref(this.firebaseStorage, this.account.photoURL)).then(() => {
                    this.account.photoURL = null;
                    subscriber.next(null);
                });
            } else {
                const uid = this.account.uID;
                const serverpath = `profile-pics/${uid}.${extension}`;
                fetch(imageurl)
                    .then(image => image.blob())
                    .then(blob => uploadBytes(ref(this.firebaseStorage, serverpath), blob))
                    .then(res => getDownloadURL(res.ref))
                    .then(newpath => {
                        this.account.photoURL = newpath;
                        this.accountObs.next(this.account);
                        subscriber.next(newpath);
                    })
                    .catch(err => subscriber.error(err))
                    .finally(() => subscriber.complete());
            }
        });
    }

    updateTeamProfile(newUser: Partial<IEEEMember>) {
        let data = { ...newUser };
        console.log(data);
        return new Observable<string>(subscriber => {
            getDocs(query(collectionGroup(this.afs, "members"), where("email", "==", newUser.email)))
                .then(members => {
                    let queries: Promise<void>[] = [];
                    members.forEach(member => {
                        queries.push(updateDoc(member.ref, data));
                    });
                    return queries;
                }).then(Promise.all)
                .then(() => subscriber.next(newUser.photo))
                .catch((err) => subscriber.error(err))
                .finally(() => subscriber.complete());
        })
    }

    sendVerificationEmail(returnLink?: string): Observable<boolean> {
        return new Observable<boolean>((subscriber) => {
            if (!this.firebaseAuth.currentUser)
                return subscriber.error(AuthErrorCodes.USER_SIGNED_OUT);
            const linkOptions: ActionCodeSettings = {
                url: returnLink
            }
            sendEmailVerification(this.firebaseAuth.currentUser, linkOptions)
                .then(() => subscriber.next(true))
                .catch((err: AuthError) => subscriber.error(err))
                .finally(() => subscriber.complete());
        });
    }

    sendPasswordResetEmail(email?: string, returnLink?: string): Observable<boolean> {
        return new Observable<boolean>((subscriber) => {
            if (!email && !this.firebaseAuth.currentUser)
                return subscriber.error(AuthErrorCodes.USER_SIGNED_OUT);
            const linkOptions: ActionCodeSettings = {
                url: returnLink
            }
            sendPasswordResetEmail(this.firebaseAuth, email || this.firebaseAuth.currentUser.email, linkOptions)
                .then(() => subscriber.next(true))
                .catch((err: AuthError) => subscriber.error(err))
                .finally(() => subscriber.complete());
        });
    }

    deleteAccount(): Observable<boolean> {
        return new Observable<boolean>((subscriber) => {
            if (!this.firebaseAuth.currentUser)
                return subscriber.error(AuthErrorCodes.USER_SIGNED_OUT);
            deleteDoc(doc(this.afs, 'users', this.firebaseAuth.currentUser.email))
                .then(() => this.firebaseAuth.currentUser.delete())
                .then(() => {
                    this.account = null;
                    this.accountObs.next(null);
                    subscriber.next(true);
                })
                .catch((err: AuthError | FirestoreError) => subscriber.error(err))
                .finally(() => subscriber.complete());
        });
    }

    reloadToken(): Observable<void> {
        return new Observable<void>((subscriber) => {
            this.user.reload()
                .then(() => this.user.getIdToken(true))
                .then(() => {
                    subscriber.next();
                }).catch(err => {
                    subscriber.error(err);
                }).finally(() => {
                    subscriber.complete();
                });
        })
    }

    // -----------Info Getters-----------

    // Get user Name
    getCurrentUser(): Observable<IEEEuser | null> {
        return this.accountObs.asObservable();
    }
}
