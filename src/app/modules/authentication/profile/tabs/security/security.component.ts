import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/authorization/auth.service';
import { IEEEuser } from 'src/app/shared/models/ieee-user/ieee-user';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.css']
})
export class SecurityComponent implements OnInit {

  user$: Observable<IEEEuser>;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
      this.user$ = this.authService.getCurrentUser();
  }

  sendVerificationEmail(): void {
      this.authService.sendVerificationEmail().subscribe({
        next: () => {
          console.log('Email sent');
        },
        error: (err) => {
          console.log('Error sending email', err);
        }
      });
  }

  sendPasswordResetEmail(): void {
      this.authService.sendPasswordResetEmail().subscribe({
        next: () => {
          console.log('Email sent');
        },
        error: (err) => {
          console.log('Error sending email', err);
        }
      });
  }

  deleteAccount(): void {
      this.authService.deleteAccount().subscribe({
        next: () => {
          console.log('Account deleted');
          this.router.navigate(['login']);
        },
        error: (err) => {
          console.log('Error deleting account', err);
        }
      });
  }

}
