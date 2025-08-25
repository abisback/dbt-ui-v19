import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// import { environment } from 'src/environments/environment';
import { JwtHelperService } from "@auth0/angular-jwt";
import { ServiceResponse } from '../model/serviceresponse';
import { User } from '../model/user.model';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiurl = environment.api_url+"auth/"+environment.version+"/";

  constructor(private http:HttpClient,
    private route:Router) { }

  proceedLogin(usercred:any){
    //console.log(this.apiurl+'Login');
    return this.http.post<ServiceResponse<User>>(this.apiurl+'Login', usercred, {observe: 'response'});
  }
  proceedOtpLogin(usercred:any){
    //console.log(this.apiurl+'Login');
    return this.http.post<ServiceResponse<User>>(this.apiurl+'OtpLogin', usercred, {observe: 'response'});
  }
  getCaptchaImage(){
    return this.http.get<{captchaImg:any; captchaId: string}>(this.apiurl+'get-captcha-image');
  //  debugger;
  //   return this.http.get(this.apiurl+'get-captcha-image');
  }

  ProceedLogOut(){
    localStorage.clear();
    this.route.navigate(['signin']);
  }

  IsLoggedIn(){
    const jwtHelper = new JwtHelperService ();
    var isLoggedInFlag = false;
    var token = localStorage.getItem('token');
    if(token!=null){
      if(!jwtHelper.isTokenExpired(token)){
        isLoggedInFlag = true;
      }else{
        localStorage.clear();
      }
    }

    return isLoggedInFlag;
  }

  roleMatch(allowedRoles: Array<string>): boolean {
    let isMatch = false;
    const role = localStorage.getItem('role');
    if (role) {
      allowedRoles.forEach((element) => {
        if (role==element) {
          isMatch = true;
          return;
        }
      });
    }
    return isMatch;
  }

  GetToken(){
    return localStorage.getItem('token')||'';
  }

  HaveAccess(){
    var loggedInToken = localStorage.getItem('token');
    if(loggedInToken != null){
      var _extractedToken = loggedInToken?.split('.')[1]||'';
      var _atobdata = atob(_extractedToken);
      var _finaldata = JSON.parse(_atobdata);
      //console.log(_finaldata);
      if(_finaldata.Role == 'STATE'){
        return true;
      }
    }
    alert('User not Authorized');
    return false;
  }
}
