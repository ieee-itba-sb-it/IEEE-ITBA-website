import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth.service';
import { auth } from 'firebase';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private authService: AuthService) { }

  //Data
  signupForm: HTMLElement;
  alertText: HTMLElement;
  
  //Visual vars
  isHidden: boolean;
  isHidden2: boolean;
  isHidden3: boolean;

  //Form data
  fname: string;
  lname: string;
  email: string;
  pass: string;
  passConf: string;

  //On Init
  ngOnInit(): void {

    this.isHidden=true;
    this.isHidden2=true;
    this.isHidden3=true;

    console.log("Init");

    //Consts
    this.signupForm = document.getElementById('singup-form');
    this.alertText = document.getElementById('passerr');

    //Listener submit
    this.signupForm.addEventListener('submit', (e) => {

      e.preventDefault(); //dont refresh
      console.log("Submitted.");

      //Get data
      this.email = this.signupForm['email'].value;
      this.pass = this.signupForm['pass'].value;
      this.passConf = this.signupForm['passConf'].value
      //Save in database
      this.fname = this.signupForm['fname'].value;
      this.lname = this.signupForm['lname'].value;

      console.log(this.fname, this.lname, this.email, this.pass, this.passConf);
      this.isHidden3=false;

      if (this.pass==this.passConf){
        console.log("Passwords match.")
        this.authService.signup(this.email,this.pass,this.fname,this.lname,this.alertText);
      }
      else {
        this.alertText.textContent="Passwords dont match.";
        this.alertText.style.color="red";
      }

    });
    
  }

  //Change Pass
  chgpass(){

    if (this.isHidden) {
      this.isHidden=false;
    }
    else {
      this.isHidden2=false;
      this.authService.changePass(document.getElementById('changepass')['emailchange'].value, document.getElementById('passChgConf'));
    }

  }
  
}