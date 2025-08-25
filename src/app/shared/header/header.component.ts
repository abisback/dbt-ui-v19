import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { SharedModule } from '../shared.module';

@Component({
  selector: 'app-header',
  imports: [SharedModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {


  @Output() toggleSideBar: EventEmitter<any> = new EventEmitter()

  public username: any;
  public userrole:any;
  public rolename:any;
  public userid:any;
  constructor(private service:AuthService) { }

  ngOnInit(): void {
    this.username = localStorage.getItem('username');
    this.userrole=localStorage.getItem('role');
    this.userid=localStorage.getItem('userId');

    // console.log(this.userid);
    // console.log(this.userrole);
    // debugger;

    if(this.userrole=="SADM")
    {
      this.rolename= "STATE ADMIN";
    }
    else if(this.userrole=="SNOD")
    {
      this.rolename= "STATE NODAL";
    }
    else if(this.userrole=="DADM")
    {
      this.rolename= "DEPARTMENT ADMIN";
    }
    else if(this.userrole=="DNOD")
    {
      this.rolename= "DEPARTMENT NODAL";
    }
    else if(this.userrole=="DOPT")
    {
      this.rolename= "DEPARTMENT OPERATOR";
    }
  }

  onClickSideBarToggle(){
    this.toggleSideBar.emit();
  }

  onClickLogOut(){
    this.service.ProceedLogOut();
  }


}
