import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { Observable } from 'rxjs';
import { HtmlAstPath } from '@angular/compiler';

@Injectable()
export class AuthService {

  //Vars
  user: Observable<firebase.User>;

  //Constructor
  constructor(private firebaseAuth: AngularFireAuth) {
    this.user = firebaseAuth.authState;
  }

  //Methods
  signup(email: string, password: string, element: HTMLElement) {
    this.firebaseAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Success!', value);
        element.textContent="Signed Up!";
        element.style.color="green";
      })
      .catch(err => {
        console.log('Something went wrong:',err.message);

        //Switch error
        switch (err.code){
          case "auth/email-already-in-use": { //Email used
            element.textContent="Email already in use.";
            element.style.color="red";
            break;
          }
          case "auth/invalid-email": { //Invalid email
            element.textContent="Invalid email.";
            element.style.color="red";
            break;
          }
          case "auth/weak-password": { //Weak pass
            element.textContent="Pass too weak.";
            element.style.color="red";
            break;
          }
          default: { //Default
            element.textContent="Error.";
            element.style.color="red";
            break;
          }
        }

      });

  }

  login(email: string, password: string) {
    this.firebaseAuth.auth.signInWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Nice, it worked!');
      })
      .catch(err => {
        console.log('Something went wrong:',err.message);
      });
  }

  logout() {
    this.firebaseAuth.auth.signOut();
  }

  changePass(email: string, element: HTMLElement) {
    this.firebaseAuth.auth.sendPasswordResetEmail(email)
    .then(value => {
      console.log('Success!', value);
      element.textContent="Email Sent!";
      element.style.color="green";
    })
    .catch(err => {
      console.log('Something went wrong:',err.message);
      console.log("error code0: "+ err.code);

      //Message the user
      switch (err.code) {
        case "auth/invalid-email": {
          element.textContent="Invalid email address.";
          element.style.color='red';
          break;
        }
        case "auth/user-not-found": {
          element.textContent="No user corresponding to provided email.";
          element.style.color='red';
          break;
        }
        default: {
          element.textContent="Error.";
          element.style.color='red';
          break;
        }
      }

    });

  }

}