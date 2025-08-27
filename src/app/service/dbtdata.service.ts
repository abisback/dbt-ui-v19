import { ListKeyManager } from '@angular/cdk/a11y';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
// import { environment } from 'src/environments/environment';
import { ApprovalProcess } from '../model/approval-process.model';
import { DBTData } from '../model/dbtdata.model';
import { MontlyDBTStatus } from '../model/month-dbt-status.model';
import { ServiceResponse } from '../model/serviceresponse';
import { EncryptedData } from '../model/encrypteddata.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DbtdataService {

  apiurl = environment.api_url+"dbtdata/"+environment.version+"/";

  constructor(private http:HttpClient) { }

  getDBTDataByDept(status?:any): Observable<DBTData[]> {
    if(status==null){
      return this.http.get<ServiceResponse<DBTData[]>>(this.apiurl+"GetDBTDataList")
        .pipe(map(response => response.result as DBTData[]));
    }
    else{
      return this.http.get<ServiceResponse<DBTData[]>>(this.apiurl+"GetDBTDataList/"+status)
        .pipe(map(response => response.result as DBTData[]));
    }

  }
  // getDBTDataByDept(deptId:any): Observable<DBTData[]> {
  //   if(deptId == null||deptId == ""){
  //     deptId = -1;
  //   }
  //   return this.http.get<ServiceResponse<DBTData[]>>(this.apiurl+"DBTDataByDeptList/"+deptId)
  //       .pipe(map(response => response.result as DBTData[]));
  // }

  getDBTDataByScheme(schemeId:number): Observable<DBTData[]> {
    if(schemeId == null){
      schemeId = -1;
    }
    return this.http.get<ServiceResponse<DBTData[]>>(this.apiurl+"DBTDataBySchemeList/"+schemeId)
        .pipe(map(response => response.result as DBTData[]));
  }


  ActivateDeactivateDBTData(code: any){
      return this.http.get<ServiceResponse<boolean>>(this.apiurl+"toggleActive/"+code);
  }

  GetDBTData(code:any){
    return this.http.get<ServiceResponse<DBTData>>(this.apiurl+"DBTData/"+code);
  }

  RegisterDBTData(inputdata:any){
    return this.http.post<ServiceResponse<string>>(this.apiurl+"Save", inputdata);
  }

  RegisterDBTDataNewFormat(inputdata:any){
    return this.http.post<ServiceResponse<string>>(this.apiurl+"SaveDbtData", inputdata);
  }

  RegisterDraftDBTData(inputdata:any){
    return this.http.post<ServiceResponse<string>>(this.apiurl+"SaveDraft", inputdata);
  }

  RegisterDBTDataIncremental(inputdata:any){
    return this.http.post<ServiceResponse<string>>(this.apiurl+"SaveIncremental", inputdata);
  }
  InsertInIncremental(inputdata:any){
    return this.http.post<ServiceResponse<string>>(this.apiurl+"SaveIncrementalDataTable", inputdata);
  }
  RegisterSchemeDetails(inputdata:any){
    return this.http.post<ServiceResponse<string>>(this.apiurl+"GetSchemeEntryData", inputdata);
  }

  getTransType(inputdata:any):Observable<any>{
    return this.http.get<any>(this.apiurl+"getTransType/"+inputdata);
  }

  getDbtidWiseData(inputdata:any):Observable<any>{
    return this.http.get<any>(this.apiurl+"getDbtIdwiseData/"+inputdata);
  }

//------------------------------------------------------------
  // GetSchemeInformation(schemeId:any,finYr:any){
  //   return this.http.get<ServiceResponse<string>>(this.apiurl+"GetSchemeInformation/"+schemeId+"/"+finYr);
  // }

  GetSchemeInformation(schemeId:any,finYr:any):Observable<any>{
    return this.http.get<any>(this.apiurl+"GetSchemeInformation/"+schemeId+"/"+finYr);
  }
  ViewSchemeInformation():Observable<any>{
    return this.http.get<any>(this.apiurl+"ViewSchemeEntryData/");
  }
  GetBendDetails(inputdata:any):Observable<any>{
    return this.http.post<any>(this.apiurl+"GetBenDetails", inputdata);
  }

  DoesDBTDataExists(finYr:any, month:any, schemeId:any){
    return this.http.get<ServiceResponse<boolean>>(this.apiurl+"doesExists/"+finYr+"/"+month+"/"+schemeId);
  }

  GetProcessApplicationList(deptId:any){
    if(deptId == null||deptId == ""){
      deptId = -1;
    }
    return this.http.get<ServiceResponse<DBTData[]>>(this.apiurl+"GetProcessApplicationList/"+deptId)
    .pipe(map(response => response.result as DBTData[]));
  }
  //
  GetFinalApplicationList(deptId:any){
    if(deptId == null||deptId == ""){
      deptId = -1;
    }
    return this.http.get<ServiceResponse<DBTData[]>>(this.apiurl+"GetFinalApplicationList/"+deptId)
    .pipe(map(response => response.result as DBTData[]));
  }

  // GetProcessApplicationListByScheme(schemeId:number = -1){
  //   if(schemeId == null){
  //     schemeId = -1;
  //   }
  //   return this.http.get<ServiceResponse<DBTData[]>>(this.apiurl+"GetProcessApplicationListByScheme/"+schemeId)
  //   .pipe(map(response => response.result as DBTData[]));
  // }
  GetProcessApplicationListByScheme(deptId:any, schemeCode:any){
    // console.log(`depertmentID = ${deptId} & schemeCode == ${schemeCode}` + typeof(schemeCode));
    return this.http.get<ServiceResponse<DBTData[]>>(this.apiurl+ `c/${deptId}/${schemeCode}`)
    .pipe(map(response => response.result as DBTData[]));
  }

  GetFinalApplicationListByScheme(schemeId:number = -1){
    if(schemeId == null){
      schemeId = -1;
    }
    return this.http.get<ServiceResponse<DBTData[]>>(this.apiurl+"GetFinalApplicationListByScheme/"+schemeId)
    .pipe(map(response => response.result as DBTData[]));
  }

  ProcessApplication(inputdata:ApprovalProcess){
    return this.http.post<ServiceResponse<ApprovalProcess>>(this.apiurl+"SaveApprovalProcess", inputdata);
  }
  //
  PushToBharatDbt(inputdata:ApprovalProcess){
    return this.http.post<ServiceResponse<string>>(this.apiurl+"PushToBharatDbt", inputdata);
  }

  PushToBharatDbt2(inputdata:any[]){
    return this.http.post<ServiceResponse<string>>(this.apiurl+"PushToBharatDbt2", inputdata);
  }
  RejectApplication(inputdata:ApprovalProcess){
    return this.http.post<ServiceResponse<ApprovalProcess>>(this.apiurl+"RejectApprovalProcess", inputdata);
  }

  SchemeWiseMonthlyReportingStatus(schemeId:number = -1){
    if(schemeId == null){
      schemeId = -1;
    }
    return this.http.get<ServiceResponse<MontlyDBTStatus[]>>(this.apiurl+"Report/GetYearwiseMonthlyStatus/"+schemeId);
  }

  GetBenMatrix():Observable<any>{
    return this.http.get<any>(this.apiurl+"GetBenMatrix/");
  }
  GetBenMatrix_New():Observable<any>{
    return this.http.get<any>(this.apiurl+"GetBenMatrix_New/");
  }
  GetMisSchemedtls(schemecode:number):Observable<any>{
    return this.http.get<any>(this.apiurl+"getMisSchemeMonthWiseReport/"+schemecode);
  }

  GetMisSchemeNameWisedtls(scheme:number):Observable<any>{
    return this.http.get<any>(this.apiurl+"getMisSchemeMonthWiseNameReport/"+scheme);
  }
  GetLastMonthDbtData(scheme:number, type:number):Observable<any>{
    return this.http.get<any>(this.apiurl+"getLastMonthDbtData/"+scheme+"/"+type);
  }
  EditDbtData(inputdata:any){
    return this.http.post<any>(this.apiurl+"EditDbtData/", inputdata);
  }
  GetCommentsDbtData(dbtid:number):Observable<any>{
    return this.http.get<any>(this.apiurl+"viewComments/"+dbtid);
  }
  GetDepartmentWiseMisReport(deptCode:any,monthId:any, currentPage: any, pageSize: any):Observable<any>{
    return this.http.get<any>(this.apiurl+"getDepartmentWiseMisReport/"+deptCode+"/"+monthId+"/"+"?PageNumber="+currentPage +"&PageSize="+pageSize);
  }

  GetAllDepartmentWiseMisReport():Observable<any>{
    return this.http.get<any>(this.apiurl+"getAllDepartmentWiseMisReport");
  }

  DbtDataForEdit(dbtid:number):Observable<any>{
    return this.http.get<any>(this.apiurl+"DbtDataForEdit/"+dbtid);
  }

  SaveEditedDbtData(inputdata:any){
    return this.http.post<any>(this.apiurl+"SaveEditedDbtData/", inputdata);
  }

  AllDBTDataByDept(deptid:number):Observable<any>{
    return this.http.get<any>(this.apiurl+"GetAllDbtDataByDept/"+deptid);
  }

  GetDbtDataFinyrMonthWise(finyr:number, month:number):Observable<any>{
    return this.http.get<any>(this.apiurl+"GetFinalApplicationListByFinyrMonth/"+finyr+"/"+month);
  }

  GetAllApplicationListByScheme(schemeId:number = -1){
    if(schemeId == null){
      schemeId = -1;
    }
    return this.http.get<ServiceResponse<DBTData[]>>(this.apiurl+"GetAllApplicationListByScheme/"+schemeId)
    .pipe(map(response => response.result as DBTData[]));
  }


  GetDbtDataDeptSchemeFinyrMonthWise(deptcode:number,schemecode:number,finyr:number, month:number, status:number):Observable<any>{
    return this.http.get<any>(this.apiurl+"GetFinalApplicationListByDeptSchemeFinyrMonth/"+deptcode+"/"+schemecode+"/"+finyr+"/"+month+"/"+status);
  }

  GetProcessApplicationListByDeptSchemeFinyrMonth(deptcode:number,schemecode:number,finyr:number, month:number):Observable<any>{
    return this.http.get<any>(this.apiurl+"GetProcessApplicationListByDeptSchemeFinyrMonth/"+deptcode+"/"+schemecode+"/"+finyr+"/"+month);
  }

  GetAllListByDeptSchemeFinyrMonth(deptcode:number,schemecode:number,finyr:number, month:number):Observable<any>{
    return this.http.get<any>(this.apiurl+"GetAllListByDeptSchemeFinyrMonth/"+deptcode+"/"+schemecode+"/"+finyr+"/"+month);
  }

  GetReportPushData(deptcode:number,schemecode:number,finyr:number, month:number):Observable<any>{
    return this.http.get<any>(this.apiurl+"GetReportPushData/"+deptcode+"/"+schemecode+"/"+finyr+"/"+month);
  }
  GetReportPushDataPaged(deptcode:number,schemecode:number,finyr:number, month:number, payload: any):Observable<any>{
    return this.http.post<any>(this.apiurl+"GetReportPushDataPaged/"+deptcode+"/"+schemecode+"/"+finyr+"/"+month, payload);
  }
}
