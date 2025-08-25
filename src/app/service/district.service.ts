import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
// import { environment } from 'src/environments/environment';
import { District } from '../model/district.model';
import { ServiceResponse } from '../model/serviceresponse';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DistrictService {
  apiurl = environment.api_url+"district/"+environment.version+"/";

  constructor(private http:HttpClient) { }

  getDistricts(): Observable<District[]> {
    return this.http.get<ServiceResponse<District[]>>(this.apiurl+"DistrictList")
    .pipe(map(response => response.result as District[]));
  }

  ActivateDeactivateDistrict(code: any){
    return this.http.get<ServiceResponse<boolean>>(this.apiurl+"toggleActive/"+code);
  }

  GetDistrict(code:any){
    return this.http.get<ServiceResponse<District>>(this.apiurl+"District/"+code);
  }

  SaveDistrict(inputdata:any){
    return this.http.post<ServiceResponse<District>>(this.apiurl+"Save", inputdata);
  }
}
