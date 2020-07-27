import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth.service';

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
  text: string;

  //Form data
  fname: string;
  lname: string;
  email: string;
  pass: string;
  passConf: string;

  //On Init
  ngOnInit(): void {

    console.log("init");

    //Consts
    this.signupForm = document.getElementById('singup-form');
    this.alertText = document.getElementById('passerr');

    //Listener submit
    this.signupForm.addEventListener('submit', (e) => {

      e.preventDefault(); //dont refresh
      console.log("Submitted");

      //Get data
      this.email = this.signupForm['email'].value;
      this.pass = this.signupForm['pass'].value;
      this.passConf = this.signupForm['passConf'].value
      this.fname = this.signupForm['fname'].value;
      this.lname = this.signupForm['lname'].value;

      console.log(this.fname, this.lname, this.email, this.pass, this.passConf);

      if (this.pass==this.passConf){
        console.log("Passwords match.")
        if(this.authService.signup(this.email, this.pass)){
          this.text="There was an error.";
          this.alertText.style.color="red";
        }
        else{
          this.text="Success.";
          this.alertText.style.color="green";
        } 
      }
      else {
        console.log("Passwords dont match.")
          this.text="Passwords dont match.";
          this.alertText.style.color="red";
      }

    });
    
  }
  
}