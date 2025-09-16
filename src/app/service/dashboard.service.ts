import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { environment } from 'src/environments/environment';
import { ServiceResponse } from '../model/serviceresponse';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  apiurl = environment.api_url+"dashboard/"+environment.version+"/";
  apiurl_dept = environment.api_url+"Department/"+environment.version+"/";



  constructor(private http: HttpClient) { }

  GetTopExpensiveSchemes(finYear: number) {
    return this.http.get(this.apiurl + 'TopExpenditureScheme/'+finYear);
  }

  GetCashAndKindData(deptCode:number,schemeId:number,finyr:number){
    return this.http.get(this.apiurl+`GetCashAndKind/${deptCode}/${schemeId}/${finyr}`);
  }

  GetFundTransferAndExpenditure(schemeId:number){
    return this.http.get(this.apiurl+'GetFundTransferAndExpenditure/'+schemeId);
  }

  GetNotReportedSchemeList( schemeId:number,filterValue:number){
    return this.http.get(this.apiurl+'GetSchemeReported/'+schemeId+'/'+filterValue);
  }

  GetAllDepartmentCount(){
    return this.http.get(this.apiurl_dept+'DepartmentList');
  }

  GetBenAndAmt(){
    return this.http.get(this.apiurl+'GetBenAndAmt');
  }

  GetAllScheme(){
    return this.http.get(this.apiurl+'GetTotalscheme')
  }

  GetSchemeListDetails(deptCode: any,financialYearId: any){
    return this.http.get(this.apiurl+`GetSchemeListDetails/${deptCode}/${financialYearId}`)
  }
}
