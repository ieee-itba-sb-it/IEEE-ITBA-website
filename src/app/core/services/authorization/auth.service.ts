import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { createRegularUser } from '../../../shared/models/data-types';
import { IEEEuser } from '../../../shared/models/ieee-user/ieee-user';

@Injectable({
  providedIn: 'root',
})

export class AuthService {

  // Vars
  user: Observable<firebase.User | null >;
  accountObs: Observable<IEEEuser>;
  account: IEEEuser;

  // Constructor
  constructor(private firebaseAuth: AngularFireAuth, private router: Router, private afs: AngularFirestore) {

    this.user = firebaseAuth.authState;

    // Seteamos observer
    firebaseAuth.onAuthStateChanged(function(usuario) {
      if (usuario) {

        // Get user info from database
        {
          console.log('Getting user data from db...');
          if (usuario){
            console.log('Logged in user found.');
            const ans: BehaviorSubject<IEEEuser> = new BehaviorSubject(null);

            afs.collection('users').doc(usuario.email).get().subscribe(
              data => {
              // Save the updated data to our local var
                const doc: any = data.data();
                ans.next(createRegularUser(doc.fname, doc.lname, doc.email, doc.photoURL, doc.uID));
                this.accountObs = ans.asObservable;
              });
          }
          else {
            console.log('No logged in user found. (Shouldnt get here)');
          }
        }

      }
      else {
        // User is signed out.
        console.log('User logged out.');
      }
    });

  }

  getAuthUser() {
    return this.firebaseAuth.authState.pipe(
      map( (user) => user.uid )
    );
  }

  // ---------------Methods---------------

  // Signup with email and password
  signup(email: string, password: string, fname: string, lname: string, element: HTMLElement) {

    this.firebaseAuth.createUserWithEmailAndPassword(email, password)
      .then(value => {

        this.getAuthUser().subscribe( (userId) => {
          this.account = createRegularUser(fname, lname, email, '', userId);
          // console.log('Success!', value);
          element.textContent = 'Signed Up!';
          element.style.color = 'green';

          this.afs.collection('users').doc(email).set(this.account).then(data => {
            // console.log('News item with reference '+email +' added.');
          });
        });

      })
      .catch(err => {
        // console.log('Something went wrong:',err.message);

        // Switch error
        switch (err.code){
          case 'authentication/email-already-in-use': { // Email used
            element.textContent = 'Email already in use.';
            element.style.color = 'red';
            break;
          }
          case 'authentication/invalid-email': { // Invalid email
            element.textContent = 'Invalid email.';
            element.style.color = 'red';
            break;
          }
          case 'authentication/weak-password': { // Weak pass
            element.textContent = 'Pass too weak.';
            element.style.color = 'red';
            break;
          }
          default: { // Default
            element.textContent = 'Error.';
            element.style.color = 'red';
            break;
          }
        }

      });

  }

  // Login with email and password
  login(email: string, password: string, element: HTMLElement) {

    this.firebaseAuth.signInWithEmailAndPassword(email, password)
    .then(value => {
     // console.log('Success!');
      element.textContent = 'Logged In!';
      element.style.color = 'green';
      // Get his info

      // Redirect home
      setTimeout(() => {
        this.router.navigate(['home']);
      }, 2000);  // 2s
    })
    .catch(err => {
     // console.log('Something went wrong:',err.message);

      // Message the user
      switch (err.code) {
        case 'authentication/invalid-email': {
          element.textContent = 'Invalid email address.';
          element.style.color = 'red';
          break;
        }
        case 'authentication/user-not-found': {
          element.textContent = 'No user corresponding to provided email.';
          element.style.color = 'red';
          break;
        }
        case 'authentication/wrong-password': {
          element.textContent = 'Wrong Password.';
          element.style.color = 'red';
          break;
        }
        case 'authentication/user-disabled': {
          element.textContent = 'User disabled.';
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

  // Logout
  logout() {
    this.firebaseAuth.signOut();
  }

  // Check user state
  isUserLogued(){
    this.user = this.firebaseAuth.authState;
    if (this.user) {
      return true;
    }
    else{
      return false;
    }
  }

  // Change password
  changePass(email: string, element: HTMLElement) {
    this.firebaseAuth.sendPasswordResetEmail(email)
    .then(value => {
     // console.log('Success!', value);
      element.textContent = 'Email Sent!';
      element.style.color = 'green';
    })
    .catch(err => {
      // console.log('Something went wrong:',err.message);

      // Message the user
      switch (err.code) {
        case 'authentication/invalid-email': {
          element.textContent = 'Invalid email address.';
          element.style.color = 'red';
          break;
        }
        case 'authentication/user-not-found': {
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
    const ans: BehaviorSubject<IEEEuser> = new BehaviorSubject(null);

    this.firebaseAuth.onAuthStateChanged((usuario) => {
      if (usuario){ // There is an user
        firebase.firestore().collection('users').doc(usuario.email).get().then((data) => {
          const doc: any = data.data();
          ans.next(createRegularUser(doc.fname, doc.lname, doc.email, doc.photoURL, doc.uID));
        });
      }
    });

    return ans.asObservable();

  }
}
