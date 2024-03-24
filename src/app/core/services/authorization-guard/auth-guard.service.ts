import { Injectable, inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateFn } from '@angular/router';
import { AuthService } from '../authorization/auth.service';

import { Observable, of } from 'rxjs';
import { IEEEuser } from '../../../shared/models/ieee-user/ieee-user';
import { roles } from '../../../shared/models/roles/roles.enum';

import {UserService} from '../user/user.service';


@Injectable({
    providedIn: 'root'
})
export class PermissionsService {

    user: Observable<IEEEuser>;

    constructor(private authService: AuthService, private router: Router, private userService: UserService) { }

    // here we check if user is logged in or not
    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean{
        const expectedRole: Array<roles> = next.data.expectedRole;
        this.user = this.authService.getCurrentUser();

        const p: Promise<boolean> = new Promise((resolve, reject) => {
            this.user.subscribe( async (usuario: IEEEuser) => {
                if (usuario){
                    const userRole: number = usuario.role || await this.userService.getCurrentUserRole(usuario.email);

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
        });

        return p;
    }
}

export const AuthGuardService: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean => {
    return inject(PermissionsService).canActivate(next, state);
}
