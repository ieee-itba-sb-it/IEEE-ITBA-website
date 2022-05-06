import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../authorization/auth.service';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { IEEEuser } from '../../../shared/models/ieee-user/ieee-user';
import { roles } from '../../../shared/models/roles/roles.enum';
import { catchError } from 'rxjs/operators';

import {UserService} from '../user/user.service';


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


    const p: Promise<boolean> = new Promise((resolve, reject) => {
      setTimeout(() => {
        this.user.subscribe( async (usuario: IEEEuser) => {

          if (usuario){
            const userRole: number = await this.userService.getCurrentUserRole(usuario.email);

            if (expectedRole.includes(userRole)){
              return resolve(true);
            }else{
              this.router.navigate(['error401']);
              return resolve(false);
            }
          }else{
            this.router.navigate(['login']);
            return resolve(false);
          }
        });
      }, 2000);
    });

    return p;

  }

}
