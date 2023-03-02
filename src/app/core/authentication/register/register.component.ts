import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/authorization/auth.service';
import { auth } from 'firebase';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private authService: AuthService) {
    scroll(0, 0);
  }

  // Data
  signupForm: HTMLElement | any;
  alertText: HTMLElement;

  // Visual vars
  isHidden: boolean;
  isHidden2: boolean;
  isHidden3: boolean;

  // Form data
  fname: string;
  lname: string;
  email: string;
  pass: string;
  passConf: string;

  // On Init
  ngOnInit(): void {

    this.isHidden = true;
    this.isHidden2 = true;
    this.isHidden3 = true;

    // Consts
    this.signupForm = document.getElementById('singup-form');
    this.alertText = document.getElementById('passerr');

    // Listener submit
    this.signupForm.addEventListener('submit', (e) => {

      e.preventDefault(); // dont refresh

      // Get data
      this.email = this.signupForm.email.value;
      this.pass = this.signupForm.pass.value;
      this.passConf = this.signupForm.passConf.value;
      // Save in database
      this.fname = this.signupForm.fname.value;
      this.lname = this.signupForm.lname.value;

      this.isHidden3 = false;

      if (this.pass === this.passConf){
        this.authService.signup(this.email, this.pass, this.fname, this.lname, this.alertText);
      }
      else {
        this.alertText.textContent = 'Passwords dont match.';
        this.alertText.style.color = 'red';
      }

    });

  }

  // Change Pass
  chgpass(){

    if (this.isHidden) {
      this.isHidden = false;
    }
    else {
      this.isHidden2 = false;
      const changePassElem: any = document.getElementById('changepass');
      this.authService.changePass(changePassElem.emailchange.value, document.getElementById('passChgConf'));
    }

  }

}
