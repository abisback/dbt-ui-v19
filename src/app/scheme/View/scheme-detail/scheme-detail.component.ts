import { Component, Inject } from '@angular/core';
import { Scheme } from '../../../model/scheme.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HelperService } from '../../../service/helper.service';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-scheme-detail',
  imports: [SharedModule],
  templateUrl: './scheme-detail.component.html',
  styleUrl: './scheme-detail.component.scss'
})
export class SchemeDetailComponent {
  viewData:Scheme | undefined;
  constructor(  
    public dialogRef: MatDialogRef<SchemeDetailComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: Scheme,
    public helperService: HelperService
  ) { }

  ngOnInit(): void {
    this.viewData = this.data;
    //console.log(this.viewData);
  }
}
