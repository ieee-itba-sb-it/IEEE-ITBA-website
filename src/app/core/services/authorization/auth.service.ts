import {Injectable} from '@angular/core';

import firebase from 'firebase/compat/app';
import {Router} from '@angular/router';


import {BehaviorSubject, Observable} from 'rxjs';
import {createRegularUser} from '../../../shared/models/data-types';
import {IEEEuser} from '../../../shared/models/ieee-user/ieee-user';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import UserCredential = firebase.auth.UserCredential;

@Injectable({
  providedIn: 'root',
})

export class AuthService {

  // Vars
  user: firebase.User;
  accountObs: Observable<IEEEuser>;
  account: IEEEuser;

  // Constructor
  constructor(private firebaseAuth: AngularFireAuth, private router: Router, private afs: AngularFirestore) {

    // this.user = firebaseAuth.auth.currentUser;
    firebaseAuth.currentUser.then((user) => this.user = user);

    // Seteamos observer
    firebaseAuth.onAuthStateChanged((usuario) => {
      if (usuario) {
        // Get user info from database
        if (usuario){
          const ans: BehaviorSubject<IEEEuser> = new BehaviorSubject(null);

          afs.collection('users').doc(usuario.email).get().subscribe( data => {
            // Save the updated data to our local var
            const doc = data.data() as IEEEuser;
            ans.next(createRegularUser(doc.fname, doc.lname, doc.email, doc.photoURL, doc.uID));
            this.accountObs = ans;
          });
        }
      }
    });

  }

  // ---------------Methods---------------

  // Signup with email and password
  signup(email: string, password: string, fname: string, lname: string): Observable<UserCredential> {
    return new Observable((subscriber) => {
      this.firebaseAuth.createUserWithEmailAndPassword(email, password)
        .then(async value => {
          this.account = createRegularUser(fname, lname, email, '',
            await this.firebaseAuth.currentUser.then((user) => user.uid)/* this.firebaseAuth.auth.currentUser.uid */);
          this.afs.collection('users').doc(email).set(this.account).then(data => {
          });
          subscriber.next(value);
        })
        .catch(err => {
          subscriber.error(err);
        })
        .finally(subscriber.complete);
    });
  }

  // Login with email and password
  login(email: string, password: string): Observable<UserCredential> {
    return new Observable<UserCredential>(
      (subscriber) => {
        this.firebaseAuth.signInWithEmailAndPassword(email, password)
          .then(value => {
            subscriber.next(value);
          })
          .catch(err => {
            subscriber.error(err);
          }).finally(
          () => {
            subscriber.complete();
          }
        );
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
    this.firebaseAuth.sendPasswordResetEmail(email)
    .then(value => {
      element.textContent = 'Email Sent!';
      element.style.color = 'green';
    })
    .catch(err => {
      // Message the user
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

    });

  }

  // -----------Info Getters-----------

  // Get user Name
  getCurrentUser(): Observable<IEEEuser> {
    return new Observable<IEEEuser>((subscriber) => {
      this.firebaseAuth.onAuthStateChanged((usuario) => {
        if (usuario){ // There is an user
          firebase.firestore().collection('users').doc(usuario.email).get().then((data) => {
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
