import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { District } from '../../../model/district.model';
import { Department } from '../../../model/department.model';
import { CodeValues } from '../../../model/code-values.model';
import { Scheme } from '../../../model/scheme.model';
import { Month } from '../../../model/month.model';
import { MasterService } from '../../../service/master.service';
import { DepartmentService } from '../../../service/department.service';
import { DistrictService } from '../../../service/district.service';
import { DbtdataService } from '../../../service/dbtdata.service';
import { SchemeService } from '../../../service/scheme.service';
import { MonthService } from '../../../service/month.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';
import { DataUploadLevelType, MasterCodeType, Transfer_Type } from '../../../../app_enum';

@Component({
  selector: 'app-add-incremental-dbt',
  imports: [SharedModule],
  templateUrl: './add-incremental-dbt.component.html',
  styleUrl: './add-incremental-dbt.component.scss'
})
export class AddIncrementalDbtComponent {

  dbtDataForm = new FormGroup({
    deptCode: new FormControl(),
    entryLevel: new FormControl(),
    districtCode: new FormControl(),
    schemeCode: new FormControl(),
    // finYrCode:new FormControl(),
    financialYear: new FormControl(),
    totalBen: new FormControl('', Validators.maxLength(5)),
    totalBenWithBank: new FormControl('', Validators.maxLength(10)),
    totalBenDigitized: new FormControl('', Validators.maxLength(10)),
    benAadharSeeded: new FormControl('', Validators.maxLength(10)),
    mobileCaptured: new FormControl('', Validators.maxLength(10)),
    benefitType: new FormControl(),
    reportingMonth: new FormControl(),
    fundTrnsferCash: new FormControl(),
    expenditureKind: new FormControl(),
    noTrnsCashElectronic: new FormControl(),
    amntTrnsCashElectronic: new FormControl(),
    noTrnsCashOther: new FormControl(),
    amntTrnsCashOther: new FormControl(),
    trnsAadharSeeded: new FormControl(),
    unitKind: new FormControl(),
    qtyTransferedKind: new FormControl(),
    aadharTransKind: new FormControl(),
    noDeDuplicated: new FormControl(),
    noGhost: new FormControl(),
    otherSavings: new FormControl(),
    savingAmnt: new FormControl(),
    remarks: new FormControl(),
  })
  filteredlist: any[] = [];
  districtList: District[] = [];
  departmentList: Department[] = [];
  benefitTypeList: CodeValues[] = [];
  financialYearList: CodeValues[] = [];
  // financialYear!: ServiceResponse<CodeValues>[] =[];
  financialYear: any;
  schemeList: Scheme[] = []
  dataUploadLevelList: any[] = [];
  reportingMonthList: Month[] = [];
  reportmonth: any[] = [];
  isSchemeFound: boolean = false;
  showDistrictDropDown: boolean = false;
  showCashTypeField: boolean = false;
  showKindTypeField: boolean = false;



  constructor(private masterService: MasterService,
    private departmentService: DepartmentService,
    private districtService: DistrictService,
    private dbtDataService: DbtdataService,
    private schemeService: SchemeService,
    private monthService: MonthService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<AddIncrementalDbtComponent>
  ) { }

  ngOnInit(): void {
    let deptCode = localStorage.getItem('deptCode');

    let a = this.departmentService.encryptPassword(deptCode);
    //console.log(btoa(a));
    let enccd = btoa(a);

    // this.masterService.getCodeValues(MasterCodeType.Financial_Year).subscribe(x=>{
    //   this.financialYearList = x;
    //    console.log(this.financialYearList);
    // });

    this.masterService.getCodeValues(MasterCodeType.Benefit_Type).subscribe(x => {
      this.benefitTypeList = x;
      //console.log(this.departmentList);
    });

    this.masterService.getCodeValueById(MasterCodeType.finYrCode).subscribe((x: any) => {
      // this.financialYear.push(x);
      //console.log();
      this.financialYear = x;
      //console.log(x.codeValueDesc);
    });

    if (deptCode == "" || deptCode == null) {
      this.departmentService.getDepartments().subscribe(x => {
        this.departmentList = x;
        // console.log(this.departmentList);
      });
    } else {
      this.departmentService.GetDepartment(enccd).subscribe(x => {
        if (x.errorMessage == null)
          this.departmentList.push(x.result);
        //console.log(this.departmentList[0].name);
        //this.dbtDataForm.get('deptCode')?.patchValue(this.departmentList[0].name);
        //deptCode : object= this.departmentList[1];
        this.dbtDataForm.patchValue({ deptCode: this.departmentList[0].name });

      });
    }
    //   this.dbtDataForm = this.fb.group({
    //     itemCtrl : ['']
    //   });
    //   this.setDefaultValue();
    // }

    // setDefaultValue(){
    //   this.dbtDataForm.patchValue({
    //     itemCtrl : this.items[1].value
    //   })

    this.masterService.getCodeValues(MasterCodeType.DataUploadLevel).subscribe(x => {
      this.dataUploadLevelList = x;
      // console.log(this.benefitTypeList);
    });

    this.monthService.getMonths().subscribe(x => {
      this.reportingMonthList = x;
      //console.log(this.reportingMonthList);
    });
    this.monthService.GetMonth(1).subscribe(x => {
      // this.reportmonth = x;
      if (x.errorMessage == null)
        this.reportmonth.push(x.result);
      //console.log(this.reportmonth);
    });
    //this.yourForm.get('contentType').patchValue(this.contentTypes[0].name);
    //this.dbtDataForm.get('deptCode')?.patchValue(this.departmentList[0].name);
  }

  onDepartmentChange(event: any) {
    this.dbtDataForm.reset();
    this.dbtDataForm.patchValue({ deptCode: event.value });
    this.schemeService.findActiveSchemes(event.value).subscribe(x => {
      this.schemeList = x;
      this.showDistrictDropDown = false;
      this.showCashTypeField = false;
      this.showKindTypeField = false;
      if (this.schemeList.length > 0) {
        this.isSchemeFound = true;
      } else {
        this.isSchemeFound = false;
        this.toastr.warning("No Scheme Mapped with this department");
      }
    });
  }

  onDataUploadLevelChange(event: any) {
    if (event.value == DataUploadLevelType["District Level"]) {
      this.districtService.getDistricts().subscribe(x => {
        this.districtList = x;
        // console.log(this.departmentList);
      });
      this.showDistrictDropDown = true;
    } else {
      this.showDistrictDropDown = false;
    }
  }

  onBenefitTypeChange(event: any) {
    if (event.value == Transfer_Type['Cash']) {
      this.showCashTypeField = true;
      this.showKindTypeField = false;

    } else if (event.value == Transfer_Type['In Kind']) {
      this.showKindTypeField = true;
      this.showCashTypeField = false;
    } else if (event.value == Transfer_Type['Cash and In Kind']) {
      this.showCashTypeField = true;
      this.showKindTypeField = true;

    }
  }
  getFinYearFromId(key: any) {
    let finYear: string = "";
    this.financialYearList.filter((item: CodeValues) => {
      if (item.codeValueId.toLowerCase().includes(key.toLowerCase())) {
        finYear = item.codeValueDesc.trim();
      }
    });
    return finYear;
  }

  updateFinYear(key: any) {
    let financialYear: string = "";
    financialYear = this.getFinYearFromId(key.value);
    this.dbtDataForm.patchValue({ financialYear: financialYear });
  }
  onSchemeChange(event: any) {
    // var a:any[]=[];
    // debugger;

    // let Id=event.value;


    // this.schemeService.getTypeId(Id).subscribe(x=>{
    //   this.filteredlist = x;
    //   console.log(this.filteredlist);
    //   console.log(this.filteredlist[0].transferType);
    //   // a:[]=this.filteredlist;
    //   // var b:number=a[0].transferType;
    //   // console.log(b);

    //   //console.log(a[0].transferType);

    // });
    //console.log(this.filteredlist[0].transferType);
    //debugger;

    // console.log("OnSchemechange hit")

  }
  onSubmit() {
    if (this.dbtDataForm.valid) {
      // Object.keys(this.dbtDataForm.controls).forEach(key => {
      //   if(this.dbtDataForm.get(key)?.value == null)
      //     this.dbtDataForm.patchValue({$key: 0});
      // })
      //console.log(this.dbtDataForm.value);
      this.dbtDataService.RegisterDBTDataIncremental(this.dbtDataForm.value).subscribe(response => {
        if (response.errorMessage != null) {
          // alert(response.errorMessage);
          this.toastr.error(response.errorMessage);

        } else {
          //this.toastr.success('');
          this.dialogRef.close('DBT Data Saved Successfully');
        }
      });
    }
  }

}
