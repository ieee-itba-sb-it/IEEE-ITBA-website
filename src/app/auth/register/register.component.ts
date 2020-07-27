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
        this.authService.signup(this.email, this.pass);
      }
      else {
        console.log("Passwords dont match.")
      }

    });
    
  }
  
}