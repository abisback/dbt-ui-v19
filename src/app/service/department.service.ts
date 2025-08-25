import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
// import { environment } from 'src/environments/environment';
import { Department } from '../model/department.model';
import { ServiceResponse } from '../model/serviceresponse';
import * as CryptoJS from "crypto-js";
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  encryptedPassword!: string;

  apiurl = environment.api_url+"department/"+environment.version+"/";

  constructor(private http:HttpClient) { }

  getDepartments(): Observable<Department[]> {
    return this.http.get<ServiceResponse<Department[]>>(this.apiurl+"DepartmentList")
    .pipe(map(response => response.result as Department[]));
  }

  ActivateDeactivateDepartment(code: any){
    return this.http.get<ServiceResponse<boolean>>(this.apiurl+"toggleActive/"+code);
  }

  GetDepartment(code:any){
    // let s=this.encryptPassword(code);
    //console.log(code);

    return this.http.get<ServiceResponse<Department>>(this.apiurl+"Department/"+code);
  }


  GetScheme(code:any){
    return this.http.get<ServiceResponse<Department>>(this.apiurl+"Scheme/"+code);
  }
  SaveDepartment(inputdata:any){
    return this.http.post<ServiceResponse<Department>>(this.apiurl+"Save", inputdata);
  }
  UpdateDepartment(inputdata:any){
    return this.http.post<ServiceResponse<Boolean>>(this.apiurl+"Update", inputdata);
  }

  encryptPassword(str:any) {
    //debugger;
    const key = CryptoJS.enc.Utf8.parse(environment.AesKey);
    const iv = CryptoJS.enc.Utf8.parse(environment.AesIV);
    return this.encryptedPassword = CryptoJS.AES.encrypt(
      str,
      key,
      {
        keySize: 128 / 8,
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    ).toString();
  }

}
