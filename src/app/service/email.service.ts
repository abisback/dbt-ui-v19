import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class EmailService {

  apiurl = environment.api_url + 'MailUser/' + environment.version + '/';
  
  constructor(private http:HttpClient) {}
  getMailList() {
    return this.http.get(`${this.apiurl}MailUsersList`);
  }
}
