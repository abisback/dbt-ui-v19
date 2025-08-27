import { Component, Inject } from '@angular/core';
import { Department } from '../../../model/department.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HelperService } from '../../../service/helper.service';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-department-detail',
  imports: [SharedModule],
  templateUrl: './department-detail.component.html',
  styleUrl: './department-detail.component.scss'
})
export class DepartmentDetailComponent {
  viewData: Department | undefined;

  constructor(public dialogRef: MatDialogRef<DepartmentDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Department,
    public helperService: HelperService) { }

  ngOnInit(): void {
    this.viewData = this.data;
    //console.log(this.viewData);
  }
}
