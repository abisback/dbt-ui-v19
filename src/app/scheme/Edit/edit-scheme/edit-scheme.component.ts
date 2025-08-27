import { Component, Inject } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CodeValues } from '../../../model/code-values.model';
import { Department } from '../../../model/department.model';
import { MasterService } from '../../../service/master.service';
import { DepartmentService } from '../../../service/department.service';
import { SchemeService } from '../../../service/scheme.service';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../../../service/notification.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MasterCodeType, USERROLE } from '../../../../app_enum';

@Component({
  selector: 'app-edit-scheme',
  imports: [SharedModule],
  templateUrl: './edit-scheme.component.html',
  styleUrl: './edit-scheme.component.scss'
})
export class EditSchemeComponent {

  schemeForm = new FormGroup({
    id: new FormControl(),
    deptCode: new FormControl(),
    schemeType: new FormControl(),
    schemeName: new FormControl('', [Validators.required, Validators.pattern("^.{1,225}$")]),
    schemeCode: new FormControl('', [Validators.pattern("^.{1,30}$")]),
    transferType: new FormControl(),
    bharatDbtSecretKey: new FormControl(),
    fundingPattern: new FormControl('', [Validators.maxLength(5), Validators.pattern('^([0-9]*:[0-9]*)$')]),

    centralShare: new FormControl(),
    stateShare: new FormControl(),
    additionalStateShare: new FormControl(),

    dBTSchemeCode_B: new FormControl('', [Validators.pattern("^(b|B)[a-zA-Z0-9]{1,15}$")]),
    dBTSchemeCode_C: new FormControl(),
    dBTSchemeCode_E: new FormControl('', [Validators.pattern("^(e|E)[a-zA-Z0-9]{1,15}$")]),
    onBoarded: new FormControl(),
    progress: new FormControl(),
    misIntegrated: new FormControl(),
    active: new FormControl()
  })

  schemeTypeList: CodeValues[] = [];
  departmentList: Department[] = [];
  benefitTypeList: CodeValues[] = [];
  progressTypeList: CodeValues[] = [];
  decisionTypeList: CodeValues[] = [];
  schemeTypeName: any;
  isAdmin: any;


  constructor(private masterService: MasterService, private formBuilder: FormBuilder,
    private departmentService: DepartmentService, private schemeService: SchemeService,
    private toastr: ToastrService,
    private notify: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EditSchemeComponent>) {
  }


  ngOnInit(): void {

        let role = localStorage.getItem('role');
    
        if ((role == USERROLE['State Level Admin'])) {
          this.isAdmin = true;
        }
    

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
    //console.log(this.data.eventData);

    this.masterService.getCodeValueById(this.data.eventData.schemeType).subscribe((res: any) => {

      this.schemeTypeName = res.codeValueDesc;
      //console.log(this.schemeTypeName);
      this.bindData();
    });
    // this.schemeForm = this.formBuilder.group({
    //   transferType: [this.data.eventData.transferType] // Set the default selected value here
    // });
    //this.bindData();

  }
  bindData() {

    this.schemeForm.patchValue({

      

      schemeName: this.data.eventData.schemeName,
      schemeType: this.schemeTypeName,
      schemeCode: this.data.eventData.schemeCode,
      dBTSchemeCode_B: (this.data.eventData.dbtSchemeCode_B) ? this.data.eventData.dbtSchemeCode_B.trim() : this.data.eventData.dbtSchemeCode_B,
      dBTSchemeCode_C: this.data.eventData.dbtSchemeCode_C,
      dBTSchemeCode_E: (this.data.eventData.dbtSchemeCode_E) ? this.data.eventData.dbtSchemeCode_E.trim() : this.data.eventData.dbtSchemeCode_E,
      fundingPattern: (this.data.eventData.fundingPattern) ? this.data.eventData.fundingPattern.trim() : this.data.eventData.fundingPattern,

      centralShare: (this.data.eventData.centralShare) ? this.data.eventData.centralShare : this.data.eventData.centralShare,
      stateShare: (this.data.eventData.stateShare) ? this.data.eventData.stateShare : this.data.eventData.stateShare,
      additionalStateShare: (this.data.eventData.additionalStateShare) ? this.data.eventData.additionalStateShare : this.data.eventData.additionalStateShare,

      deptCode: this.data.eventData.deptName,
      transferType: ((this.data.eventData.transferType == '1') ? 'Cash' : this.data.eventData.transferType == '2' ? 'In Kind' : 'Cash and In Kind'),
      progress: ((this.data.eventData.progress == '4') ? 'Online system / MIS at Conceptual Stage' : ((this.data.eventData.progress == '5') ?
        'Online system / MIS under development' : ((this.data.eventData.progress == '6') ? 'Online system / MIS implemented at field level (Roll out) and data reported manually'
          : ((this.data.eventData.progress == '7') ? 'Online system / MIS integrated with State DBT Portal but data reported manually' : 'Online system / MIS integrated with State DBT Portal and report submitted through web-services')))),
      onBoarded: this.data.eventData.onBoarded == true ? 'Yes' : 'No',
      misIntegrated: this.data.eventData.misIntegrated == true ? 'Yes' : 'No',

      bharatDbtSecretKey: this.data.eventData.bharatDbtSecretKey,
    });
  }
  get eventData() {
    return this.data.eventData;
  }

  onSubmit() {
    if (this.schemeForm.valid) {
      this.schemeForm.value.id = this.data.eventData.id;
      this.schemeForm.value.schemeType = this.data.eventData.schemeType;
      this.schemeForm.value.deptCode = this.data.eventData.deptCode;
      this.schemeForm.value.transferType = ((this.schemeForm.value.transferType == 'Cash') ? '1' : this.schemeForm.value.transferType == 'In Kind' ? '2' : '3');
      this.schemeForm.value.progress = ((this.schemeForm.value.progress == 'Online system / MIS at Conceptual Stage') ? 4 : ((this.schemeForm.value.progress == 'Online system / MIS under development') ?
        5 : ((this.schemeForm.value.progress == 'Online system / MIS implemented at field level (Roll out) and data reported manually') ? 6
          : ((this.schemeForm.value.progress == 'Online system / MIS integrated with State DBT Portal but data reported manually') ? 7 : 8))));

      this.schemeForm.value.onBoarded = this.schemeForm.value.onBoarded == 'Yes' ? true : false;
      this.schemeForm.value.misIntegrated = this.schemeForm.value.misIntegrated == 'Yes' ? true : false;
      this.schemeForm.value.active = true;
      this.schemeForm.value.dBTSchemeCode_C = '';
      this.schemeForm.value.bharatDbtSecretKey = this.schemeForm.value.bharatDbtSecretKey.trim();
      console.log(this.schemeForm.value);

      this.schemeService.UpdateScheme(this.schemeForm.value).subscribe(response => {
        if (response.errorMessage != null) {
          // alert(response.errorMessage);
          this.toastr.error(response.errorMessage);
        } else {
          this.dialogRef.close('Scheme Succesfully Updated');
        }
      });
    }
  }
}
