import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MDBModalRef, MDBModalService } from 'angular-bootstrap-md';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/authorization/auth.service';
import { AlertModalComponent, AlertModalType } from 'src/app/shared/components/alert-modal/alert-modal.component';
import { IEEEuser } from 'src/app/shared/models/ieee-user/ieee-user';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.css']
})
export class SecurityComponent implements OnInit {

  user$: Observable<IEEEuser>;
  error$: BehaviorSubject<string>;

  alertModalRef: MDBModalRef | null = null;

  constructor(private authService: AuthService, private modalService: MDBModalService, private router: Router, private route: ActivatedRoute) {
      this.error$ = new BehaviorSubject(null);
  }

  ngOnInit(): void {
      this.user$ = this.authService.getCurrentUser();
      this.error$.subscribe({
        next: (error) => {
          if (!error) return delete this.alertModalRef;
          this.openAlertModal("error", error);
        }
      });
      this.route.queryParams.subscribe({
        next: (params) => {
          if (params.verified) this.openAlertModal("success", "PROFILE.MESSAGES.SUCCESS_EMAIL_VERIFICATION");
          if (params.passChanged) this.openAlertModal("success", "PROFILE.MESSAGES.SUCCESS_PASSWORD_CHANGE"); 
        }
      });
      this.modalService.closed.subscribe(() => {
        this.router.navigate([], {
          queryParams: {
            'verified': null,
            'passChanged': null,
          },
          queryParamsHandling: 'merge'
        })
      });
  }

  sendVerificationEmail(): void {
      const url = `${window.location.href}?verified=true`
      this.authService.sendVerificationEmail(url).subscribe({
        next: () => this.openAlertModal("success", "PROFILE.MESSAGES.EMAIL_SENT"),
        error: (err) => this.openAlertModal("error", err)
      });
  }

  sendPasswordResetEmail(): void {
      const url = `${window.location.href}?passChanged=true`
      this.authService.sendPasswordResetEmail(undefined, url).subscribe({
        next: () => this.openAlertModal("success", "PROFILE.MESSAGES.EMAIL_SENT"),
        error: (err) => this.openAlertModal("error", err)
      });
  }

  deleteAccount(): void {
      this.authService.deleteAccount().subscribe({
        next: () => {
          this.router.navigate(['login'], {
            queryParams: {
              accountDeleted: true
            }
          });
        },
        error: (err) => this.openAlertModal("error", err)
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
