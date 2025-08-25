import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
// import { environment } from 'src/environments/environment';
import { CodeValues } from '../model/code-values.model';
import { ServiceResponse } from '../model/serviceresponse';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MasterService {
  apiurl = environment.api_url+"AppMData/"+environment.version+"/";

  constructor(private http:HttpClient) { }

  getCodeValues(codeType:number){
    return this.http.get<ServiceResponse<CodeValues[]>>(this.apiurl+"GetCodeValueByCodeTypeId/"+codeType)
      .pipe(map(response => response.result as CodeValues[]));
  }

  getCodeValueById(codeValueId:any){
    return this.http.get<ServiceResponse<any[]>>(this.apiurl+"GetCodeValueById/"+codeValueId)
      .pipe(map(response => response.result ));
  }


}
