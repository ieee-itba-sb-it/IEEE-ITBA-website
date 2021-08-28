import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/authorization/auth.service';
import { auth } from 'firebase';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent  implements OnInit {

  constructor(private authService: AuthService) { }

  //Data
  signupForm: HTMLElement;
  alertText: HTMLElement;

  //Visual vars
  isHidden: boolean;

  //Form data
  email: string;
  pass: string;

  //On Init
  ngOnInit(): void {

    this.isHidden=true;

    //console.log("Init");

    //Consts
    this.signupForm = document.getElementById('account');
    this.alertText = document.getElementById('passerr');

    //Listener submit
    this.signupForm.addEventListener('submit', (e) => {

      e.preventDefault(); //dont refresh
     // console.log("Submitted.");

      //Get data
      this.email = this.signupForm['email'].value;
      this.pass = this.signupForm['pass'].value;

      //console.log(this.email, this.pass);

      //Login
      //console.log("Trying to log in...");
      this.isHidden=false;
      this.authService.login(this.email,this.pass,this.alertText);

    });

  }

}
