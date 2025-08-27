import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { NotificationService } from '../../../service/notification.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Department } from '../../../model/department.model';
import { Scheme } from '../../../model/scheme.model';
import { UserRole } from '../../../model/userrole.model';
import { CodeValues } from '../../../model/code-values.model';
import { MasterCodeType, USERROLE } from '../../../../app_enum';
import { MasterService } from '../../../service/master.service';
import { DepartmentService } from '../../../service/department.service';
import { UserService } from '../../../service/user.service';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { SchemeService } from '../../../service/scheme.service';

@Component({
  selector: 'app-add-user',
  imports: [SharedModule],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})
export class AddUserComponent {
  userForm = new FormGroup({
    deptCode: new FormControl(''),
    userId: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z0-9]{0,50}$")]),
    password: new FormControl(''),
    salutation: new FormControl('', [Validators.required]),
    firstName: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z]{0,50}$")]),
    middleName: new FormControl('', Validators.pattern("^[a-zA-Z]{0,50}$")),
    lastName: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z]{0,50}$")]),
    role: new FormControl(),
    email: new FormControl('', [Validators.required, Validators.email, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")]),
    phoneno: new FormControl('', [Validators.required, Validators.pattern("^[6-9]\\d{9}$")]), // ^\\d{10}$
    SchemeType: new FormControl(),
    codeValueId: new FormControl(),
    SchemeCode: new FormControl()
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
  constructor(
    private masterService: MasterService,
    private departmentService: DepartmentService, private userService: UserService,
    private SchemeService: SchemeService, private schemeService: SchemeService,
    private notify: NotificationService,
    private dialogRef: MatDialogRef<AddUserComponent>, private toastr: ToastrService
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
          // ,
          // {
          //   userRoleID: 6,
          //   userRole: "DOPT",
          //   userRoleDesc: "Department Operator",

          //   isStateAllowed: true,
          //   isDistrictAllowed: true,
          // }
        ];
      }
      else {
        //For State Users
        this.userService.GetUserRoleState().subscribe((x: { result: UserRole[]; }) => {
          this.userRoleList = x.result;
        });
      }



    } else {
      this.departmentService.GetDepartment(enccd).subscribe((x: { result: Department; }) => {
        this.departmentList.push(x.result);
      });
      //For District Users
      // this.userService.GetUserRoleDistrict().subscribe(x=>{
      //   this.userRoleList = x.result;
      // });  

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
        //console.log(this.schemeList);
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
      // console.log(this.salutationList);
    });

    // if(uploadlevel == null|| uploadlevel == "")
    // {
    //   this.masterService.getCodeValues(MasterCodeType.DataUploadLevel).subscribe(x=>{
    //     this.DataUploadLevelList = x;
    //     console.log(this.DataUploadLevelList);
    //   });
    // }
    // else{
    //   debugger;
    //   this.masterService.getCodeValueById(uploadlevel).subscribe(x=>{

    //     this.DataUploadLevelList = x;
    //     console.log(this.DataUploadLevelList);

    //   });
    // }

    this.masterService.getCodeValues(MasterCodeType.DataUploadLevel).subscribe((x) => {
      this.DataUploadLevelList = x;
      //console.log(this.DataUploadLevelList);
    });

  }
  onSubmit() {

    this.notify.confirmProposal('Are you sure ?', 'Do you really want to create the user?').then((res) => {
      if (res) {

        if (this.userForm.valid) {
          // this.userForm.patchValue({
          //   password: this.encryptedPassword
          // });
          this.userService.RegisterUser(this.userForm.value).subscribe((response) => {
            console.log(response);

            if (response.errorMessage != null) {
              this.toastr.error(response.errorMessage);
            } else {
              this.dialogRef.close('User Succesfully Registered');
            }
          });
        }
      }
    });

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
    //let deptCode = localStorage.getItem("deptCode");
    // if((event.value == USERROLE['Department Admin']))
    // {
    //   this.showSchemeList=false;
    // }
    //debugger;
    // if(event.value=='Department Admin')
    // {
    //   this.showSchemeList=false;
    // }
    // if(event.value == 'DADM')
    //  {
    //   this.showSchemeList=false;
    //  }
    //  else
    //  {
    //   this.showSchemeList=true;
    //  }

    // this.showLevelList=true;
    // if((event.value == USERROLE['Department Admin']) || (event.value == USERROLE['Department Operator']) || (event.value == USERROLE['Department Nodal'])){
    //   this.showSchemeList = true;
    // }else{
    //   this.showSchemeList = false;
    // }
  }

  SchemeChange(event: any) {
    //let deptCode = localStorage.getItem("deptCode");
    // console.log(event.value);

    this.showLevelList = true;
    // if((event.value == USERROLE['Department Admin']) || (event.value == USERROLE['Department Operator']) || (event.value == USERROLE['Department Nodal'])){
    //   this.showSchemeList = true;
    // }else{
    //   this.showSchemeList = false;
    // }
  }
    public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  allowOnlyNumbers(e: KeyboardEvent) {
    const v = (e.target as HTMLInputElement).value, k = e.key;
    if (!/^\d$/.test(k) || (v.length === 0 && !/[6-9]/.test(k)) || v.length >= 10) {
      if (!['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(k)) {
        e.preventDefault();
      }
    }
  }
  validatePaste(event: ClipboardEvent) {
    const pastedText = event.clipboardData?.getData('text');
    if (!/^\d+$/.test(pastedText || '')) {
      event.preventDefault();
    }
  }
}
