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
export class RemarksService {
  apiurl = environment.api_url+"remarks/"+environment.version+"/";

  constructor(private http:HttpClient) { }

  GetRemarks(){
    return this.http.get<ServiceResponse<boolean>>(this.apiurl+"GetRemarks");
  }

}
