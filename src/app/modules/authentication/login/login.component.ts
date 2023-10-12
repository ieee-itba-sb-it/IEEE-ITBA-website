import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/authorization/auth.service';
import {Router} from '@angular/router';
import {ApiResponse} from '../../../shared/models/data-types';
import { AppConfigService } from '../../../core/services/configuration/app-config.service';

function getErrorMessage(code) {
    switch (code) {
    case 'auth/invalid-email':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
        return 'LOGIN.ERROR.INCORRECT_USER_PASS';
    case 'auth/user-disabled': {
        return 'LOGIN.ERROR.DISABLED_USER';
    }
    default: {
        return 'LOGIN.ERROR.UNKNOWN';
    }
    }
}

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent  implements OnInit {

    constructor(private authService: AuthService, private router: Router, private appConfigService: AppConfigService) {
        scroll(0, 0);
    }

    // Data
    signupForm: HTMLElement | any;

    // Form data
    email: string;
    pass: string;

    loginResponse: ApiResponse = null;

    // On Init
    ngOnInit(): void {
        this.appConfigService.setTitle('LOGIN.PAGETITLE');
        // Consts
        this.signupForm = document.getElementById('account-form');

        // Listener submit
        this.signupForm.addEventListener('submit', (e) => {
            // alert('submitted');
            e.preventDefault(); // dont refresh

            // Get data
            this.email = this.signupForm.email.value;
            this.pass = this.signupForm.pass.value;

            // Login
            this.loginResponse = null;
            this.authService.login(this.email, this.pass).subscribe({
                next: (_) => {
                    this.loginResponse = {
                        success: true,
                        message: 'LOGIN.SUCCESS',
                    };
                    setTimeout(() => {
                        this.router.navigate(['home']);
                    }, 1000);
                },
                error: (err) => {
                    this.loginResponse = {
                        success: false,
                        message: getErrorMessage(err.code),
                    };
                }
            });
        });
    }
}
