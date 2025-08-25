import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { AutoLogoutService } from './auto-logout.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor{

  constructor(private inject:Injector, private router:Router,private au1:AutoLogoutService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //debugger;
    let authService = this.inject.get(AuthService);
    //console.log(authService.GetToken());
    if(authService.GetToken()!= ''){
      let jwtToken = req.clone({
        setHeaders:{
          
          Authorization: 'bearer '+authService.GetToken(),

        }
      });
      return next.handle(jwtToken).pipe( tap(() => {},
          (err: any) => {
            //debugger;
          if (err instanceof HttpErrorResponse) {
            // console.log('token');
            // console.log(err);
            if (err.status !== 401) {

              return;
            }
            localStorage.clear();
           // this.au1.check();
            
            this.router.navigate(['signin']);
          }
        }));
        //-location.reload();
      //return next.handle(jwtToken);
    }
    else{
      return next.handle(req).pipe( tap(() => {},
          (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status !== 401) {
            return;
            }
            localStorage.clear();
            //this.au1.check();
            this.router.navigate(['signin']);
          }
        }));
    }
  }
}
