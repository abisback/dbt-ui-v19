import { Component, Inject } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Department } from '../../../model/department.model';
import { Scheme } from '../../../model/scheme.model';
import { UserRole } from '../../../model/userrole.model';
import { CodeValues } from '../../../model/code-values.model';
import { User } from '../../../model/user.model';
import { MasterService } from '../../../service/master.service';
import { DepartmentService } from '../../../service/department.service';
import { UserService } from '../../../service/user.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { SchemeService } from '../../../service/scheme.service';
import { MasterCodeType, USERROLE } from '../../../../app_enum';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-edit-user',
  imports: [SharedModule],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss'
})
export class EditUserComponent {

  userForm = new FormGroup({
    id: new FormControl(''),
    deptCode: new FormControl(''),
    userId: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z0-9]{0,50}$")]),
    salutation: new FormControl('', [Validators.required]),
    firstName: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z]{0,50}$")]),
    middleName: new FormControl('', Validators.pattern("^[a-zA-Z]{0,50}$")),
    lastName: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z]{0,50}$")]),
    role: new FormControl(),
    email: new FormControl('', [Validators.required, Validators.email]),
    phoneno: new FormControl('', [Validators.required, Validators.pattern("^\\d{10}$")]),
    SchemeType: new FormControl(),
    codeValueId: new FormControl(),
    SchemeCode: new FormControl(),
  })
  public showPassword: boolean = false;
  showDepartmentList: boolean = false;
  showSchemeList: boolean = false;
  showLevelList: boolean = false;
  encryptedPassword!: string;
  departmentList: Department[] = [];
  schemeList: Scheme[] = [];
  userRoleList: UserRole[] = [];
  salutationList: CodeValues[] = [];
  DataUploadLevelList: CodeValues[] = [];

  decisionTypeList: CodeValues[] = [];
  userdata: User[] = [];
  changepassword: boolean = false;
  defaultSalutationValue: any;
  roledetails: any;
  isdepartment: boolean = false;

  constructor(private masterService: MasterService,
    private departmentService: DepartmentService, private userService: UserService,
    private SchemeService: SchemeService, private schemeService: SchemeService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EditUserComponent>, private toastr: ToastrService
  ) { }

  ngOnInit(): void {

    //debugger;
    let deptCode = localStorage.getItem("deptCode");
    let role = localStorage.getItem("role");
    let uploadlevel = localStorage.getItem("CodeTypeId");
    let a = this.departmentService.encryptPassword(deptCode);
    //console.log(uploadlevel);
    let enccd = btoa(a);
    if (deptCode == null || deptCode == "") {
      this.departmentService.getDepartments().subscribe(x => {
        this.departmentList = x;
      });
      if (role == "SADM") {
        this.userRoleList = [
          {
            userRoleID: 3,
            userRole: "SNOD",
            userRoleDesc: "State Nodal",

            isStateAllowed: true,
            isDistrictAllowed: true,
          },
          {
            userRoleID: 4,
            userRole: "DADM",
            userRoleDesc: "Department Admin",

            isStateAllowed: true,
            isDistrictAllowed: true,
          }
        ];
      }
      else if (role == "SNOD") {
        this.userRoleList = [{
          userRoleID: 4,
          userRole: "DADM",
          userRoleDesc: "Department Admin",

          isStateAllowed: true,
          isDistrictAllowed: true,
        }
          ,
        {
          userRoleID: 5,
          userRole: "DNOD",
          userRoleDesc: "Department Nodal",

          isStateAllowed: true,
          isDistrictAllowed: true,
        }
        ];
      }
      else {
        //For State Users
        this.userService.GetUserRoleState().subscribe(x => {
          this.userRoleList = x.result;
        });
      }
    }
    else {
      this.departmentService.GetDepartment(enccd).subscribe(x => {
        this.departmentList.push(x.result);
      });

      if (role == "DADM") {
        this.userRoleList = [{
          userRoleID: 5,
          userRole: "DNOD",
          userRoleDesc: "Department Nodal",

          isStateAllowed: true,
          isDistrictAllowed: true,
        },
        {
          userRoleID: 6,
          userRole: "DOPT",
          userRoleDesc: "Department Operator",

          isStateAllowed: true,
          isDistrictAllowed: true,
        }
        ];
      }
      else if (role == "DNOD") {
        this.userRoleList = [{
          userRoleID: 6,
          userRole: "DOPT",
          userRoleDesc: "Department Operator",

          isStateAllowed: true,
          isDistrictAllowed: true,
        }]
      }
    }
    let schemecode = localStorage.getItem("schemeCode");
    //console.log(schemecode);
    if (schemecode == null || schemecode == "") {
      this.SchemeService.findActiveSchemes(Number(deptCode)!).subscribe(x => {
        this.schemeList = x;
        // console.log(this.schemeList);
      });
    }
    else {
      this.SchemeService.GetScheme(schemecode).subscribe(x => {
        this.schemeList.push(x.result);
        //console.log(x.result);
      });
    }


    this.masterService.getCodeValues(MasterCodeType.DecisionType).subscribe(x => {
      this.decisionTypeList = x;
      // console.log(this.decisionTypeList);
    });

    this.masterService.getCodeValues(MasterCodeType.Salutations).subscribe(x => {
      this.salutationList = x;
      //this.userForm.get('salutation').setValue(x[0].codeValueDesc); // Set the default selected value her
      //console.log(x[]);
    });


    this.masterService.getCodeValues(MasterCodeType.DataUploadLevel).subscribe(x => {
      this.DataUploadLevelList = x;
      //console.log(this.DataUploadLevelList);
    });


    this.userService.GetUserProfile(this.data.eventData).subscribe(res => {
      // for admin view because  admin not have any deptCode

      //console.log(res.result);
      this.userdata[0] = res.result;
      // console.log(this.userdata[0])
      this.SchemeService.findActiveSchemes(Number(this.userdata[0].deptCode)!).subscribe(x => {
        this.schemeList = x;
        // console.log(this.schemeList);
      });

      this.userForm.patchValue({
        id: this.userdata[0].id,
        userId: this.userdata[0].userId,
        //salutation:this.userdata[0].salutation,
        firstName: this.userdata[0].firstName,
        middleName: this.userdata[0].middleName,
        lastName: this.userdata[0].lastName,
        email: this.userdata[0].email,
        phoneno: this.userdata[0].phoneNo,
        SchemeCode: this.userdata[0].schemeCode,
        // schemetype: this.userdata[0].schemeCodeList,
        salutation: ((this.userdata[0].salutation == '12') ? 'Mr' : this.userdata[0].salutation == '13' ? 'Mrs' : 'Ms'),
      })

      const selectedIds = this.userdata[0].schemeCodeList
        .map(code => {
          const match = this.schemeList.find(s => s.schemeCode === code);
          return match ? match.id : null;
        })
        .filter(id => id !== null);
      this.userForm.patchValue({ SchemeType: selectedIds });
      console.log(this.userForm.value);




      this.defaultSalutationValue = this.userdata[0].salutation;
      if (this.userdata[0].role == 'SADM') {
        this.roledetails = 'State Admin'
      }
      else if (this.userdata[0].role == 'SNOD') {
        this.roledetails = 'State Nodal'
      }
      else if (this.userdata[0].role == 'DADM') {
        this.roledetails = 'Department Admin'
        this.isdepartment = true;
      }
      else if (this.userdata[0].role == 'DNOD') {
        this.roledetails = 'Department Nodal'
      }
      else if (this.userdata[0].role == 'DOPT') {
        this.roledetails = 'Department Operator'
      }
      // console.log(res);
    });
  }
  compareScheme(s1: any, s2: any): boolean {
    return s1 && s2 ? s1 === s2 : s1 === s2;
  }
  RoleChange(event: any) {
    //debugger;
    //console.log(event.value);
    if (event.value == 'DADM') {
      this.showSchemeList = false;
    }
    else {
      this.showSchemeList = true;

    }
    if (event.value == 'SNOD') {
      this.showSchemeList = false;
      this.showDepartmentList = false;
    }
    if ((event.value == USERROLE['Department Admin']) || (event.value == USERROLE['Department Operator']) || (event.value == USERROLE['State Level Admin'])) {
      this.showDepartmentList = true;
    }
    else if (event.value == USERROLE['Department Nodal']) {
      this.showDepartmentList = true;
    }
    else {
      this.showDepartmentList = false;
    }
  }

  DepartmentChange(event: any) {
    this.showLevelList = true;
  }

  SchemeChange(event: any) {
    //let deptCode = localStorage.getItem("deptCode");
    // this.showLevelList = true;
    // if((event.value == USERROLE['Department Admin']) || (event.value == USERROLE['Department Operator']) || (event.value == USERROLE['Department Nodal'])){
    //   this.showSchemeList = true;
    // }else{
    //   this.showSchemeList = false;
    // }
  }
  onSubmit() {
    // console.log(this.userForm.value);
    // this.userForm.patchValue({
    //   password: this.encryptedPassword
    // });
    if (this.userForm.valid) {
      this.userForm.value.salutation = ((this.userForm.value.salutation == "Mr") ? '12' : ((this.userForm.value.salutation == "Mrs") ? '13' : '14'))

      this.userService.UpdateUser(this.userForm.value).subscribe(response => {
        if (response.errorMessage != null) {
          this.toastr.error(response.errorMessage);
        } else {
          this.dialogRef.close('User Succesfully Updated');
        }
      });
    }

  }
  encryptPassword() {
    const key = CryptoJS.enc.Utf8.parse(environment.AesKey);
    const iv = CryptoJS.enc.Utf8.parse(environment.AesIV);
    const passwordValue = this.userForm.get('password')?.value ?? '';
    this.encryptedPassword = CryptoJS.AES.encrypt(
      passwordValue,
      key,
      {
        keySize: 128 / 8,
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    ).toString();
  }

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  get eventData() {
    return this.data.eventData;
  }

  selectedMethod(e: any) {
    if (e.value === '1') {
      this.changepassword = true;
    }
    else {
      this.changepassword = false;
    }

  }
}
