import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CodeValues } from '../../model/code-values.model';
import { Department } from '../../model/department.model';
import { MasterService } from '../../service/master.service';
import { DepartmentService } from '../../service/department.service';
import { SchemeService } from '../../service/scheme.service';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../../service/notification.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MasterCodeType, USERROLE } from '../../../app_enum';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-add-draft-scheme',
  imports: [SharedModule],
  templateUrl: './add-draft-scheme.component.html',
  styleUrl: './add-draft-scheme.component.scss'
})
export class AddDraftSchemeComponent {

  schemeForm = new FormGroup({
    deptCode: new FormControl(),
    schemeType: new FormControl(),
    schemeName: new FormControl('', [Validators.required, Validators.pattern("^.{1,100}$")]),
    transferType: new FormControl(),
    fundingPattern: new FormControl(),
    dataShareType: new FormControl(),
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

  //onBoarded: new FormControl(),//

  schemeTypeList: CodeValues[] = [];
  departmentList: Department[] = [];
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
    private dialogRef: MatDialogRef<AddDraftSchemeComponent>) {
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
        this.departmentList = x;
      });
    } else {
      this.departmentService.GetDepartment(enccd).subscribe(x => {
        this.departmentList.push(x.result);
      });
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
      this.finYearList = x;
      //console.log(this.dataShareType);
    });
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



  fundingShareValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const central = Number(control.get('centralShare')?.value) || 0;
      const state = Number(control.get('stateShare')?.value) || 0;
      const additional = Number(control.get('additionalStateShare')?.value) || 0;

      const total = central + state + additional;

      return total > 100 ? { totalExceeds: true } : null;
    };
  }



  onSubmit() {
    //console.log(this.schemeForm.value);

    this.notify.confirmProposal('Are you sure ?', 'Do you onboard this scheme?').then((res) => {
      if (res) {
        if (this.schemeForm.valid) {
          this.schemeService.RegisterDraftScheme(this.schemeForm.value).subscribe(response => {
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

}
