import { Injectable, ComponentFactoryResolver } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Route } from '@angular/compiler/src/core';

@Injectable({
  providedIn: 'root',
})

export class AuthService {

  //Vars
  user: firebase.User;

  //Constructor
  constructor(private firebaseAuth: AngularFireAuth, private router: Router) {
    this.user = firebaseAuth.auth.currentUser;

    //Seteamos observer
    firebaseAuth.auth.onAuthStateChanged(function(usuario) {
      if (usuario) {
        // User is signed in.
        var displayName = usuario.displayName;
        var email = usuario.email;
        var emailVerified = usuario.emailVerified;
        var photoURL = usuario.photoURL;
        var uid = usuario.uid;
        console.log('User info: ',displayName,email,emailVerified,photoURL,uid);
      }
      else {
        // User is signed out.
      }
    });

  }

  //Methods

  //Signup with email and password
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

  //Login with email and password
  login(email: string, password: string, element: HTMLElement) {
    this.firebaseAuth.auth.signInWithEmailAndPassword(email, password)
    .then(value => {
      console.log('Success!');
      element.textContent="Logued In!";
      element.style.color="green";
      //Redirect home
      setTimeout(() => {
        this.router.navigate(['home']);
      }, 2000);  //2s
    })
    .catch(err => {
      console.log('Something went wrong:',err.message);

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
        case "auth/wrong-password": {
          element.textContent="Wrong Password.";
          element.style.color='red';
          break;
        }
        case "auth/user-disabled": {
          element.textContent="User disabled.";
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

  //Logout
  logout() {
    this.firebaseAuth.auth.signOut();
  }

  //Check user state
  isUserLogued(){
    this.user = this.firebaseAuth.auth.currentUser;
    if (this.user) {
      return true;
    }
    else{
      return false;
    }
  }

  //User data
  getUserData(){
    return this.user;
  }

  //Change password
  changePass(email: string, element: HTMLElement) {
    this.firebaseAuth.auth.sendPasswordResetEmail(email)
    .then(value => {
      console.log('Success!', value);
      element.textContent="Email Sent!";
      element.style.color="green";
    })
    .catch(err => {
      console.log('Something went wrong:',err.message);

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