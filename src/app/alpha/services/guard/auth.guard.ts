import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { resolve } from 'q';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private authService: AuthService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise((resolve) => {
        this.authService.isAuthenticated().then(
          (res) => {
            if (res){
              resolve(true);
            }else{
              this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
              resolve(false);
            }
          }
        );
      });
        // if (this.authService.isAuthenticated()){
        //   return true;
        // }
        // return this.authService.isAuthenticated();
        // not logged in so redirect to login page
        //
        // return false;
    }
}
