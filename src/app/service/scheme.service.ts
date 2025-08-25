import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
// import { environment } from 'src/environments/environment';
import { Scheme } from '../model/scheme.model';
import { ServiceResponse } from '../model/serviceresponse';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SchemeService {

  apiurl = environment.api_url+"scheme/"+environment.version+"/";

  constructor(private http:HttpClient) { }

  // findSchemes(
  //   deptCode:number = -1, filter = '', sortOrder = 'asc',
  //   pageNumber = 0, pageSize = 3): Observable<Scheme[]> {
  findSchemes(deptCode:string): Observable<Scheme[]> {
    return this.http.get<ServiceResponse<Scheme[]>>(this.apiurl+"SchemeList/"+deptCode)
        .pipe(map(response => response.result as Scheme[]));
  }
  findActiveSchemes(deptCode:number = -1): Observable<Scheme[]> {
    return this.http.get<ServiceResponse<Scheme[]>>(this.apiurl+"SchemeActiveList/"+deptCode)
        .pipe(map(response => response.result as Scheme[]));
  }

  ActivateDeactivateScheme(code: any){
      return this.http.get<ServiceResponse<boolean>>(this.apiurl+"toggleActive/"+code);
  }

  GetScheme(code:any) {
    return this.http.get<ServiceResponse<Scheme>>(this.apiurl+"Scheme/"+code);
  }

  RegisterScheme(inputdata:any){
    return this.http.post<ServiceResponse<string>>(this.apiurl+"Save", inputdata);
  }

  UpdateScheme(updatedata:any){
    return this.http.post<ServiceResponse<boolean>>(this.apiurl+"Update", updatedata);
  }
  DoesSchemeExists(schemeCode:string){
    return this.http.get<ServiceResponse<boolean>>(this.apiurl+"doesExists/"+schemeCode);
  }


  findSchemeBudgets(withScheme:boolean, schemeCode:number = -1): Observable<any[]> {
    return this.http.get<ServiceResponse<any>>(this.apiurl+"SchemeBudgetList/"+withScheme+"/"+schemeCode)
        .pipe(map(response => response.result as any[]));
  }

  findActiveSchemeBudgets(withScheme:boolean, schemeCode:number = -1): Observable<any[]> {
    return this.http.get<ServiceResponse<any>>(this.apiurl+"SchemeBudgetActiveList/"+withScheme+"/"+schemeCode)
        .pipe(map(response => response.result as any[]));
  }

  ActivateDeactivateSchemeBudget(code: any){
    return this.http.get<ServiceResponse<boolean>>(this.apiurl+"toggleBudgetActive/"+code);
  }

  RegisterSchemeBudget(inputdata:any){
    return this.http.post<ServiceResponse<string>>(this.apiurl+"SaveBudget", inputdata);
  }

  getTypeId(Id:any){
    return this.http.get<ServiceResponse<any[]>>(this.apiurl+"GetTransferType/"+Id)
      .pipe(map(response => response.result));
  }

  findSchemesForApproval(): Observable<Scheme[]> {
    return this.http.get<ServiceResponse<Scheme[]>>(this.apiurl+"SchemeListForApproval")
        .pipe(map(response => response.result as Scheme[]));
  }

  RegisterDraftScheme(inputdata:any){
    return this.http.post<ServiceResponse<string>>(this.apiurl+"SaveDraftScheme", inputdata);
  }

  RegisterApprovedScheme(inputdata:any){
    return this.http.post<ServiceResponse<string>>(this.apiurl+"ApproveDraftedScheme", inputdata);
  }

  GetSchemeByCode(code:any): Observable<any[]> {
    return this.http.get<ServiceResponse<Scheme[]>>(this.apiurl+"Scheme/"+code)
    .pipe(map(response => response.result as Scheme[]));    ;
  }

}
