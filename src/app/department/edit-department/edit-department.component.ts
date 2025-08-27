import { Component, Inject } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Department } from '../../model/department.model';
import { MasterService } from '../../service/master.service';
import { DepartmentService } from '../../service/department.service';
import { SchemeService } from '../../service/scheme.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-department',
  imports: [SharedModule],
  templateUrl: './edit-department.component.html',
  styleUrl: './edit-department.component.scss'
})
export class EditDepartmentComponent {

  deptForm = new FormGroup({
    deptCode: new FormControl(),
    name: new FormControl(),
    nameCode: new FormControl(),
    name_Symbol: new FormControl(),
    mobile: new FormControl('', [Validators.required, Validators.pattern("^\\d{10}$")]),
    email: new FormControl('', [Validators.required, Validators.email])
  })

  departmentList: Department[] = [];
  DepartmentService: any;

  constructor(
    private masterService: MasterService, private formBuilder: FormBuilder,
    private departmentService: DepartmentService, private schemeService: SchemeService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EditDepartmentComponent>
  ) { }

  ngOnInit(): void {
    //console.log(this.data);
    this.DepartmentService = this.data;
    // this.DepartmentService.GetDepartment()
    this.deptForm.patchValue({
      deptCode: this.data.eventData.deptCode,
      name: this.data.eventData.name,
      nameCode: this.data.eventData.nameCode,
      name_Symbol: this.data.eventData.name_Symbol,
      mobile: this.data.eventData.mobile,
      email: this.data.eventData.email,
    });
  }

  onSubmit() {

    if (this.deptForm.valid) {
      this.departmentService.UpdateDepartment(this.deptForm.value).subscribe(response => {
        //console.log(response);

        if (response.errorMessage != null) {
          // alert(response.errorMessage);
          this.toastr.error(response.errorMessage);
        } else {
          this.toastr.success('Department Succesfully Updated');
        }
        window.location.reload();
        // if(response)
        // {
        //   this.dialogRef.close('Department Succesfully edited');
        // }
        // else{
        //   this.dialogRef.close('Edit not succesfull');
        // }
      });

    }

  }

}
