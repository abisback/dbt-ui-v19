import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private service: AuthService, private router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.service.IsLoggedIn()) {
      var roles = route.data['roles'];
      if (!roles) {
        roles = route.firstChild?.data['roles'];
      }
      if (roles) {
        const match = this.service.roleMatch(roles);
        if (match) {
          return true;
        } else {
          //console.log('You are not authorized to access this area !!!');
          // this.router.navigate(['/login']);
          this.service.ProceedLogOut();

          return false;
        }
      } else {
        return true;
      }
    }
    this.router.navigate(['signin'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
