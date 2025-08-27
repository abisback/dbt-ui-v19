import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CodeValues } from '../../../model/code-values.model';
import { Department } from '../../../model/department.model';
import { MasterService } from '../../../service/master.service';
import { DepartmentService } from '../../../service/department.service';
import { SchemeService } from '../../../service/scheme.service';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../../../service/notification.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MasterCodeType, USERROLE } from '../../../../app_enum';

@Component({
  selector: 'app-add-scheme',
  imports: [SharedModule],
  templateUrl: './add-scheme.component.html',
  styleUrl: './add-scheme.component.scss'
})
export class AddSchemeComponent {

  schemeForm = new FormGroup({
    deptCode: new FormControl(),
    schemeType: new FormControl(),
    schemeName: new FormControl('', [Validators.required, Validators.pattern("^.{1,100}$")]),
    schemeCode: new FormControl('', [Validators.pattern("^.{1,30}$")]),
    transferType: new FormControl(),
    fundingPattern: new FormControl(),
    finYear: new FormControl(),
    dataShareType: new FormControl(),
    dBTSchemeCode_B: new FormControl('', [Validators.pattern("^(b|B)[a-zA-Z0-9]{1,15}$")]),
    dBTSchemeCode_C: new FormControl(),
    dBTSchemeCode_E: new FormControl('', [Validators.pattern("^(e|E)[a-zA-Z0-9]{1,15}$")]),
    secretKey: new FormControl(),
    //onBoarded: new FormControl(),//
    progress: new FormControl(),
    apiIntegrated: new FormControl(),//
    active: new FormControl(),


    centralShare: new FormControl('', [
      Validators.required,
      Validators.min(0),
      Validators.max(100)
    ]),
    stateShare: new FormControl('', [
      Validators.required,
      Validators.min(0),
      Validators.max(100)
    ]),
    additionalStateShare: new FormControl('', [
      Validators.required,
      Validators.min(0),
      Validators.max(100)
    ])
  }, { validators: this.fundingShareValidator() });

  schemeTypeList: CodeValues[] = [];
  departmentList: Department[] = [];
  copyDepartmentList: Department[] = [];
  benefitTypeList: CodeValues[] = [];
  progressTypeList: CodeValues[] = [];
  decisionTypeList: CodeValues[] = [];
  dataShareType: CodeValues[] = [];
  finYearList: CodeValues[] = [];
  isadmin: any;

  constructor(
    private masterService: MasterService,
    private departmentService: DepartmentService,
    private schemeService: SchemeService,
    private toastr: ToastrService,
    private notify: NotificationService,
    private dialogRef: MatDialogRef<AddSchemeComponent>) {
  }


  ngOnInit(): void {


    let role = localStorage.getItem('role');

    if ((role == USERROLE['State Level Admin'])) {
      this.isadmin = true;
    }

    console.log(this.isadmin);


    this.masterService.getCodeValues(MasterCodeType.Scheme_Type).subscribe(x => {
      this.schemeTypeList = x;
      // console.log(this.schemeTypeList);
    });

    let deptCode = localStorage.getItem("deptCode");
    let a = this.departmentService.encryptPassword(deptCode);
    //console.log(btoa(a));
    let enccd = btoa(a);
    if (deptCode == null || deptCode == "") {
      this.departmentService.getDepartments().subscribe(x => {
        this.departmentList = this.copyDepartmentList = x;
      });
    } else {
      this.departmentService.GetDepartment(enccd).subscribe(x => {
        this.departmentList.push(x.result);
      });
      this.copyDepartmentList = [...this.departmentList];
    }

    this.masterService.getCodeValues(MasterCodeType.Benefit_Type).subscribe(x => {
      this.benefitTypeList = x;
      //console.log(this.benefitTypeList);
    });
    this.masterService.getCodeValues(MasterCodeType.Progress_Type).subscribe(x => {
      this.progressTypeList = x;
      // console.log(this.progressTypeList);
    });
    this.masterService.getCodeValues(MasterCodeType.DecisionType).subscribe(x => {
      this.decisionTypeList = x;
      // console.log(this.decisionTypeList);
    });

    this.masterService.getCodeValues(MasterCodeType.Data_Share_Type).subscribe(x => {
      this.dataShareType = x;
      //console.log(this.dataShareType);
    });

    this.masterService.getCodeValues(MasterCodeType.Financial_Year).subscribe(x => {
      // this.finYearList = x;
      this.finYearList = x.sort((a, b) => b.codeValueDesc.localeCompare(a.codeValueDesc));
      //console.log(this.dataShareType);
    });
  }

  fundingShareValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const central = Number(control.get('centralShare')?.value) || 0;
      const state = Number(control.get('stateShare')?.value) || 0;
      const additional = Number(control.get('additionalStateShare')?.value) || 0;

      const total = central + state + additional;

      return total > 100 ? { totalExceeds: true } : null;
    };
  }

  clampToPercentRange() {
    const controls = [
      this.schemeForm.get('centralShare'),
      this.schemeForm.get('stateShare'),
      this.schemeForm.get('additionalStateShare')
    ];

    controls.forEach(ctrl => {
      if (!ctrl) return;

      let v = ctrl.value;

      if (v === null || v === '' || v === undefined) return;

      let n = Number(v); // cast from possible string
      if (Number.isNaN(n)) {
        ctrl.setValue(null);
        return;
      }

      if (n < 0) n = 0;
      if (n > 100) n = 100;

      ctrl.setValue(n.toString(), { emitEvent: false }); // clamp to 0–100
    });
  }



  onSubmit() {
    //console.log(this.schemeForm.value);

    this.notify.confirmProposal('Are you sure ?', 'Do you onboard this scheme?').then((res) => {
      if (res) {
        if (this.schemeForm.valid) {
          this.schemeService.RegisterScheme(this.schemeForm.value).subscribe(response => {
            if (response.errorMessage != null) {
              // alert(response.errorMessage);
              this.toastr.error(response.errorMessage);
            } else {
              this.dialogRef.close('Scheme Succesfully Saved');
            }
          });
        }
      }
    });
  }


  searchDept(e: any) {
    if (e !== undefined) {
      let term = '';
      if (e.target.value.length > 0) {
        term = e.target.value;
      }
      if (term !== undefined && term !== '' && term != null) {
        if (term.length > 0) {
          const lowerTerm = String(term).toLowerCase();
          this.departmentList = this.copyDepartmentList?.filter((data: any) => {
            return String(data.name).toLowerCase().indexOf(lowerTerm) >= 0 ||
              String(data.code).toLowerCase().indexOf(lowerTerm) >= 0;
          });
        }
      } else {
        this.departmentList = this.copyDepartmentList;
      }
    }
  }

  displayFnDepartment(deptCode: Department): string {
    const dept = this.departmentList?.find((s: any) => s.deptCode === deptCode);
    return dept ? dept.name : '';

  }
  displayFnSchemeType(schemeType: CodeValues): string {
    const dept = this.schemeTypeList?.find((s: any) => s.codeValueId === schemeType);
    return dept ? dept.codeValueDesc : '';
  }
}
