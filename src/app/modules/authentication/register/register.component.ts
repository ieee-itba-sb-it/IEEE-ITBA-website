import {Component, Input, OnInit} from '@angular/core';
import { AuthService } from 'src/app/core/services/authorization/auth.service';
import { ApiResponse } from '../../../shared/models/data-types';
import {ActivatedRoute, Router} from '@angular/router';
import { catchError, concatMap, filter, of } from 'rxjs';
import {StaticSeoService} from "../../../core/services/seo/seo-static.service";

const ERROR_MESSAGES = {
    'auth/email-already-in-use': 'REGISTER.ERROR.EMAIL_IN_USE',
    'auth/invalid-email': 'REGISTER.ERROR.INVALID_EMAIL',
    'auth/weak-password': 'REGISTER.ERROR.WEAK_PASSWORD',
    default: 'REGISTER.ERROR.UNKNOWN_ERROR',
};

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

    constructor(private authService: AuthService, private readonly router: Router, private route: ActivatedRoute, private readonly seoService: StaticSeoService) {
        scroll(0, 0);
    }

    redirectTo: string | null = null;

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
    fullname: string;
    pass: string;
    passConf: string;
    registerResponse: ApiResponse = null;

    // On Init
    ngOnInit(): void {
        this.authService.getCurrentUser().subscribe(user => {
            if (user) {
                this.router.navigate([this.redirectTo ?? "home"]);
            }
        })

        this.route.queryParams.subscribe(params => {
            this.redirectTo = params['redirectTo'] ?? 'home';
        });
        this.seoService.updateMetaTags('REGISTER.PAGETITLE', 'REGISTER.PAGEDESCRIPTION', ['REGISTER', 'IEEE', 'ITBA']);

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
            this.fullname = this.signupForm.fullname.value;

            this.isHidden3 = false;
            if (this.pass === this.passConf){
                this.registerResponse = null;
                this.authService
                    .signup(this.email, this.pass, this.fullname)
                    .pipe(
                        filter(resp => resp != null),
                        concatMap(() => this.authService.login(this.email, this.pass))
                    )
                    .subscribe({
                        next: (value) => {
                            this.registerResponse = {
                                message: 'REGISTER.SUCCESS',
                                success: true,
                            };
                            setTimeout(() => {
                                    console.log(this.redirectTo)
                                    this.router.navigate([this.redirectTo ?? "home"])
                            },
                            1000);
                        },
                        error: (err) => {
                            const message = (err.code in ERROR_MESSAGES) ? ERROR_MESSAGES[err.code] : ERROR_MESSAGES.default;
                            this.registerResponse = {
                                message,
                                success: false,
                            };
                        }
                    });
            }
            else {
                this.registerResponse = {
                    message: 'REGISTER.ERROR.PASS_DONT_MATCH',
                    success: false,
                };
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

    signupWithGoogle() {
        this.authService.googleLogin().subscribe({
            next: (value) => {
                this.registerResponse = {
                    message: 'REGISTER.SUCCESS',
                    success: true,
                };
                setTimeout(() =>
                    this.router.navigate([this.redirectTo ?? 'home']),
                1000);
            },
            error: (err) => {
                console.error(err);
            }
        });
    }

    redirectToLogin() {
        this.router.navigate(["login"], {queryParamsHandling: "preserve"})
    }

}
