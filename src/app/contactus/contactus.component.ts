import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-contactus',
  imports: [],
  templateUrl: './contactus.component.html',
  styleUrl: './contactus.component.scss'
})
export class ContactusComponent {

  constructor(private http: HttpClient) {
    let apiurl = "http://localhost:24094/api/auth/v1/TestAuth";

    this.http.get(apiurl, { observe: 'response' }).subscribe(result => {
      if (result != null) {
        //console.log(result);
      }
    })
  }

  ngOnInit(): void {
  }

}
