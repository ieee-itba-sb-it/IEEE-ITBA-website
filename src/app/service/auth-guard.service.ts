import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../auth.service';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { IEEEuser, roles } from '../data-types';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  user: Observable<IEEEuser>;

  constructor(private authService: AuthService, private router: Router) { }


  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean{
    // here we check if user is logged in or not

    const expectedRole: Array<roles> = next.data.expectedRole;

    this.user = this.authService.getCurrentUser();


    let p:Promise<boolean> = new Promise((resolve, reject) => {
      setTimeout(() => {
        this.user.subscribe( (usuario: IEEEuser) => {

          console.log("usuario", usuario);

          if (usuario && expectedRole.includes(usuario.role)){
            console.log('you shall pass');
            return resolve(true);
          }
          else {
            this.router.navigate(['login']);
            return resolve(false);
          }
        });
      }, 2000);
    });

    return p;

  }

}
