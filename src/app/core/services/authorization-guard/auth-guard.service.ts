import { Injectable, inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateFn } from '@angular/router';
import { AuthService } from '../authorization/auth.service';

import {from, map, Observable, of, switchMap} from 'rxjs';
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
    canActivate(next: ActivatedRouteSnapshot, _: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean{
        const expectedRole: Array<roles> = next.data.expectedRole;
        // getCurrentUser() should have the role already, is not necessary to call it again.
        return this.authService.getCurrentUser().pipe(switchMap((possibleUser) => {
            if (possibleUser === null) {
                return from(this.router.navigate(['login'])).pipe(map(() => false));
            }
            if (possibleUser.roles.length > 0) {
                return of(true);
            }
            return from(this.router.navigate(['error401'])).pipe(map(() => false));
        }));
    }
}

export const AuthGuardService: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean => {
    return inject(PermissionsService).canActivate(next, state);
}
