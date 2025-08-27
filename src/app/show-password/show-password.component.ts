import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-show-password',
  imports: [SharedModule],
  templateUrl: './show-password.component.html',
  styleUrl: './show-password.component.scss'
})
export class ShowPasswordComponent {

  public password:any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    //console.log(this.data.eventData);
    this.password=this.data.eventData;
  }

}
