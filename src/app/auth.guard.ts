import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { PxLoginService } from '@proffix/restapi-angular-library';
import { LogService } from 'app/log/log.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private loginService: PxLoginService,
    private logService: LogService
  ) { }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    if (this.loginService.isLoggedIn) {
      // logged in so return true
      return true;
    } else if (this.loginService.isAutoLoginActive) {
      return this.loginService.doLogin().map((auth) => {
        if (auth == null) {
          this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
          return false;
        } else {
          this.logService.setMitarbeiter(auth.Mitarbeiter);
          return true;
        }
      });
    } else {
      // not logged in so redirect zur Login page mit der return url
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }
}
