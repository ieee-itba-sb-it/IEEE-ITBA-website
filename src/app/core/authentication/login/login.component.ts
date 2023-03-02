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

  constructor(private authService: AuthService) {
    scroll(0, 0);
  }

  // Data
  signupForm: HTMLElement | any;
  alertText: HTMLElement;

  // Visual vars
  isHidden: boolean;

  // Form data
  email: string;
  pass: string;

  // On Init
  ngOnInit(): void {

    this.isHidden = true;

    // Consts
    this.signupForm = document.getElementById('account-form');
    this.alertText = document.getElementById('passerr');

    // Listener submit
    this.signupForm.addEventListener('submit', (e) => {
      // alert('submitted');
      e.preventDefault(); // dont refresh

      // Get data
      this.email = this.signupForm.email.value;
      this.pass = this.signupForm.pass.value;

      // Login
      this.isHidden = false;
      this.authService.login(this.email, this.pass, this.alertText);

    });

  }

}
