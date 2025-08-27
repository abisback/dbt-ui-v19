import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MasterService } from '../../../service/master.service';
import { DepartmentService } from '../../../service/department.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-department',
  imports: [SharedModule],
  templateUrl: './add-department.component.html',
  styleUrl: './add-department.component.scss'
})
export class AddDepartmentComponent {
  
  deptForm = new FormGroup({
    deptCode: new FormControl(),
    name: new FormControl(),
    nameCode: new FormControl(),
    name_Symbol: new FormControl(),
    mobile: new FormControl('', [Validators.required, Validators.pattern("^\\d{10}$")]),
    email: new FormControl('', [Validators.required, Validators.email])
  })

  constructor(private masterService: MasterService,
    private departmentService: DepartmentService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<AddDepartmentComponent>) {
  }


  ngOnInit(): void {
  }

  onSubmit() {
    if (this.deptForm.valid) {
      this.departmentService.SaveDepartment(this.deptForm.value).subscribe(response => {
        if (response.errorMessage != null) {
          // alert(response.errorMessage);
          this.toastr.error(response.errorMessage);
        } else {
          this.dialogRef.close('Department Succesfully Saved');
        }
      });
    }
  }
}
