import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private service: AuthService, private router: Router) { }
  canActivate() {
    if (this.service.HaveAccess()) {
      return true;
    } else {
      this.router.navigate(['signin']);
      return false;
    }
  }

}
