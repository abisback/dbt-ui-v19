import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
// import { environment } from 'src/environments/environment';
import { Month } from '../model/month.model';
import { ServiceResponse } from '../model/serviceresponse';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MonthService {
  apiurl = environment.api_url+"month/"+environment.version+"/";

  constructor(private http:HttpClient) { }

  getMonths(): Observable<Month[]> {
    return this.http.get<ServiceResponse<Month[]>>(this.apiurl+"MonthList")
    .pipe(map(response => response.result as Month[]));
  }

  ActivateDeactivateMonth(code: any){
    return this.http.get<ServiceResponse<boolean>>(this.apiurl+"toggleActive/"+code);
  }

  GetMonth(code:any){
    return this.http.get<ServiceResponse<Month>>(this.apiurl+"Month/"+code);
  }

  SaveMonth(inputdata:any){
    return this.http.post<ServiceResponse<Month>>(this.apiurl+"Save", inputdata);
  }

  GetCurrentMonth(schemeCode:any):Observable<any>{
    return this.http.get<any>(this.apiurl+"getCurrentMonth/"+schemeCode);
  }
  GetCurrentFinancialYear(schemeCode:any):Observable<any>{
    return this.http.get<any>(this.apiurl+"getCurrentFinancialYear/"+schemeCode);
  }
}
