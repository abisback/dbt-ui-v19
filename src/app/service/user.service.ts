import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
// import { environment } from 'src/environments/environment';
import { ServiceResponse } from '../model/serviceresponse';
import { User } from '../model/user.model';
import { UserRole } from '../model/userrole.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiurl = environment.api_url+"user/"+environment.version+"/";

  constructor(private http:HttpClient) { }

  findUsers(
    deptCode:number = -1, filter = '', sortOrder = 'asc',
    pageNumber = 0, pageSize = 3): Observable<User[]> {
    if(filter == null || filter == ''){
      filter = '-1';
    }

    return this.http.get<ServiceResponse<User[]>>(this.apiurl+"UserListDataTable/"+deptCode+"/"+filter+"/"+sortOrder+"/"+pageNumber+"/"+pageSize)
        .pipe(map(response => response.result as User[]));

    // return this.http.get<ServiceResponse>(this.apiurl+"UserList/-1")
      // .pipe(map(response => response.result as User[]));
  }

  ActivateDeactivateUser(code: any){
      return this.http.get<ServiceResponse<boolean>>(this.apiurl+"ToggleUserActivation/"+code);
  }

  GetUserProfile(code:any){
    return this.http.get<ServiceResponse<User>>(this.apiurl+"UserProfile/"+code);
  }

  RegisterUser(inputdata:any){
    return this.http.post<ServiceResponse<string>>(this.apiurl+"Register", inputdata);
  }

  UpdateUser(updatedata:any){
    return this.http.post<ServiceResponse<boolean>>(this.apiurl+"UpdateUser", updatedata);
  }

  ForgotPassword(cred:any){
    return this.http.post<ServiceResponse<boolean>>(this.apiurl+"ForgotPassword", cred);
  }

  ChangePassword(cred:any){
    return this.http.post<ServiceResponse<boolean>>(this.apiurl+"ChangePassword", cred);
  }

  DoesUserExists(userId:string){
    return this.http.get<ServiceResponse<boolean>>(this.apiurl+"IsUserIdExists/"+userId);
  }

  GetUserRole(){
    return this.http.get<ServiceResponse<UserRole[]>>(this.apiurl+"UserRoles");
  }
  GetUserRoleState(){
    return this.http.get<ServiceResponse<UserRole[]>>(this.apiurl+"getUserRolesState");
  }
  GetUserRoleDistrict(){
    return this.http.get<ServiceResponse<UserRole[]>>(this.apiurl+"getUserRolesDistrict");
  }

  RegeneratePassword(cred:any){
    return this.http.post<any>(this.apiurl+"RegeneratePassword", cred);
  }

  GetUserProfileByDeptRole(code:any,role:any): Observable<User[]>{
    return this.http.get<ServiceResponse<User[]>>(this.apiurl+"getUserProfileByDeptRole/"+code+"/"+role).pipe(map(response => response.result as User[]));
  }
}
