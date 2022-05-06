import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/authorization/auth.service';
import { auth } from 'firebase';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent  implements OnInit {

  constructor(private authService: AuthService, public translate: TranslateService) {
    scroll(0, 0);
    translate.addLangs(['en', 'es']);
    translate.setDefaultLang('es');
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/es|en/) ? browserLang : 'en');
  }

  // Data
  signupForm: HTMLElement;
  alertText: HTMLElement;

  // Visual vars
  isHidden: boolean;

  // Form data
  email: string;
  pass: string;

  useLanguage(language: string) {
    this.translate.use(language);
  }

  // On Init
  ngOnInit(): void {

    this.isHidden = true;

    // console.log("Init");

    // Consts
    this.signupForm = document.getElementById('account-form');
    this.alertText = document.getElementById('passerr');

    // Listener submit
    this.signupForm.addEventListener('submit', (e) => {
      // alert('submitted');
      e.preventDefault(); // dont refresh
     // console.log("Submitted.");

      // Get data
      this.email = this.signupForm['email'].value;
      this.pass = this.signupForm['pass'].value;

      // console.log(this.email, this.pass);

      // Login
      console.log('Trying to log in...');
      this.isHidden = false;
      this.authService.login(this.email, this.pass, this.alertText);

    });

  }

}
