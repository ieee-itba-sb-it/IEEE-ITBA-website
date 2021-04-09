import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../auth.service';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { IEEEuser, roles } from '../data-types';
import { catchError } from 'rxjs/operators';

import {UserService} from '../service/user.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  user: Observable<IEEEuser>;

  constructor(private authService: AuthService, private router: Router, private userService: UserService) { }


  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean{
    // here we check if user is logged in or not

    const expectedRole: Array<roles> = next.data.expectedRole;

    this.user = this.authService.getCurrentUser();


    let p:Promise<boolean> = new Promise((resolve, reject) => {
      setTimeout(() => {
        this.user.subscribe( async (usuario: IEEEuser) => {

          let userRole : number = await this.userService.getCurrentUserRole(usuario.email);
          //this is for the future!
          if (usuario && expectedRole.includes(userRole)){
            //console.log('you shall pass');
            return resolve(true);
          }
          else if(usuario){
            this.router.navigate(['home']);
            return resolve(false);
          }
          else{
            this.router.navigate(['login']);
            return resolve(false);
          }
        });
      }, 2000);
    });

    return p;

  }

}
