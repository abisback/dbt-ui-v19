import { Component, Inject } from '@angular/core';
import { DbtdataService } from '../service/dbtdata.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-view-comments',
  imports: [SharedModule],
  templateUrl: './view-comments.component.html',
  styleUrl: './view-comments.component.scss'
})
export class ViewCommentsComponent {

  comment:any;

  constructor(private dbtDataService: DbtdataService,
    @Inject(MAT_DIALOG_DATA) public data: any,) { }

  ngOnInit(): void {
    //console.log(this.data.eventData);
    
    this.dbtDataService.GetCommentsDbtData(this.data.eventData).subscribe(response => {
      this.comment = response.data;
      //console.log(this.comment);
     // console.log(response.data);
      //console.log(this.dataSource.filteredData);
    });
  }
}
