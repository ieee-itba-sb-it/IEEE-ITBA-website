import {Component, Input, OnInit} from '@angular/core';
import { AuthService } from 'src/app/core/services/authorization/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiResponse} from '../../../shared/models/data-types';
import { AppConfigService } from '../../../core/services/configuration/app-config.service';
import { MDBModalRef, MDBModalService } from 'angular-bootstrap-md';
import { AlertModalComponent, AlertModalType } from 'src/app/shared/components/alert-modal/alert-modal.component';
import {StaticSeoService} from "../../../core/services/seo/seo-static.service";

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

    constructor(private authService: AuthService, private router: Router, private modalService: MDBModalService, private route: ActivatedRoute, private seoService: StaticSeoService) {
        scroll(0, 0);
    }

    @Input() redirectTo: string;

    // Data
    signupForm: HTMLElement | any;

    // Form data
    email: string;
    pass: string;

    loginResponse: ApiResponse = null;

    alertModalRef: MDBModalRef | null = null;

    // On Init
    ngOnInit(): void {
        this.seoService.updateMetaTags('LOGIN.PAGETITLE', 'LOGIN.PAGEDESCRIPTION', ['LOGIN', 'IEEE', 'ITBA']);
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
                        this.router.navigate([this.redirectTo ? this.redirectTo : 'home']);
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

        // Alert modal subscribers
        this.route.queryParams.subscribe({
            next: (params) => {
              if (params.accountDeleted) this.openAlertModal("success", "PROFILE.MESSAGES.SUCCESS_ACCOUNT_DELETION"); 
            }
          });
        this.modalService.closed.subscribe(() => {
            this.router.navigate([], {
                queryParams: {
                'accountDeleted': null
                },
                queryParamsHandling: 'merge'
            })
        });
    }

    signupWithGoogle() {
        this.authService.googleLogin().subscribe({
            next: (value) => {
                this.loginResponse = {
                    success: true,
                    message: 'LOGIN.SUCCESS',
                };
                setTimeout(() => {
                    this.router.navigate([this.redirectTo ? this.redirectTo : 'home']);
                }, 1000);
            },
            error: (err) => {
                console.error(err);
            }
        });
    }

    openAlertModal(type: AlertModalType, message: string): void {
        this.alertModalRef = this.modalService.show(AlertModalComponent, {
            data: {
                message: message,
                type: type
            },
            class: 'modal-dialog-centered',
        });
      }
}
