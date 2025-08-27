import { Component, ViewChild } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { District } from '../../../model/district.model';
import { Department } from '../../../model/department.model';
import { CodeValues } from '../../../model/code-values.model';
import { getLastMonthData, Scheme } from '../../../model/scheme.model';
import { Month } from '../../../model/month.model';
import { MatPaginator } from '@angular/material/paginator';
import { MasterService } from '../../../service/master.service';
import { DepartmentService } from '../../../service/department.service';
import { DistrictService } from '../../../service/district.service';
import { DbtdataService } from '../../../service/dbtdata.service';
import { SchemeService } from '../../../service/scheme.service';
import { MonthService } from '../../../service/month.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';
import { DataUploadLevelType, MasterCodeType, Transfer_Type } from '../../../../app_enum';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-add-dbtdata',
  imports: [SharedModule],
  templateUrl: './add-dbtdata.component.html',
  styleUrl: './add-dbtdata.component.scss'
})
export class AddDbtdataComponent {

  dbtDataForm: FormGroup;
  filteredlist: any[] = [];
  districtList: District[] = [];
  departmentList: Department[] = [];
  benefitTypeList: CodeValues[] = [];
  benefitTypeList1: any;
  benefitTypeList2: any[] = [];

  financialYearList: CodeValues[] = [];
  // financialYear!: ServiceResponse<CodeValues>[] =[];
  financialYear: any;
  schemeList: Scheme[] = []
  dataUploadLevelList: any[] = [];
  dataUploadLevelList1: any;
  reportingMonthList: Month[] = [];
  reportmonth: any[] = [];
  isSchemeFound: boolean = false;
  showDistrictDropDown: boolean = false;
  showCashTypeField: boolean = false;
  showKindTypeField: boolean = false;
  curmonth: any;
  recmonth: any;
  transtype: any;
  schemecode: any;
  displayedColumns: string[] = ['name', 'value', 'row_num', 'total'];
  dataSource: any;
  incval: any;
  students: string[] = [];
  public array: any;
  currentPage: number = 0;
  pageSize: number = 5;
  totalSize: number = 0;
  tableflag: boolean = false;
  tabledata: boolean = false;
  wbJson: any;

  defval = [
    { name: 'Total Beneficiary', value: '0' },
    { name: 'Total Beneficiary With Bank', value: '0' },
    { name: 'Total Beneficiary Digitized', value: '0' },
    { name: 'Beneficiary Aadhar Seeded', value: '0' },
    { name: 'Mobile Captured', value: '0' }
  ];
  a: any[] = [];


  @ViewChild(MatPaginator) paginator: MatPaginator | undefined
  constructor(private masterService: MasterService,
    private departmentService: DepartmentService,
    private districtService: DistrictService,
    private dbtDataService: DbtdataService,
    private schemeService: SchemeService,
    private monthService: MonthService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<AddDbtdataComponent>
  ) {
    this.dbtDataForm = new FormGroup({
      deptCode: new FormControl(),
      entryLevel: new FormControl(),
      districtCode: new FormControl(),
      schemeCode: new FormControl(),
      finYrCode: new FormControl(),
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
      increaseData: new FormControl(),
    })
  }

  ngOnInit(): void {
    let deptCode = localStorage.getItem('deptCode');

    this.schemecode = localStorage.getItem('schemeCode');
    //console.log(this.schemecode);
    let a = this.departmentService.encryptPassword(deptCode);
    //console.log(btoa(a));
    let enccd = btoa(a);

    this.masterService.getCodeValues(MasterCodeType.Financial_Year).subscribe(x => {
      this.financialYearList = x;
      //console.log(this.financialYearList);
    });

    this.masterService.getCodeValues(MasterCodeType.Benefit_Type).subscribe(x => {
      this.benefitTypeList = x;
      //console.log(this.benefitTypeList);
    });

    this.masterService.getCodeValueById(MasterCodeType.finYrCode).subscribe((x: any) => {
      // this.financialYear.push(x);
      //console.log();
      this.financialYear = x;
      //console.log(this.financialYear.codeValueDesc);
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
      });
    }

    // this.masterService.getCodeValues(MasterCodeType.DataUploadLevel).subscribe(x => {
    //   this.dataUploadLevelList = x;
    //   // console.log(this.benefitTypeList);
    // });

    this.masterService.getCodeValueById(50).subscribe(x => {
      this.dataUploadLevelList1 = x;
      //console.log(this.dataUploadLevelList1);
    });


    // this.monthService.getMonths().subscribe(x => {
    //   this.reportingMonthList = x;
    //   //console.log(this.reportingMonthList);
    // });

  }

  onDepartmentChange(event: any) {
    this.dbtDataForm.reset();
    this.dbtDataForm.patchValue({ deptCode: event.value });
    if (this.schemecode == "" || this.schemecode == null) {
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
    else {
      this.schemeService.GetScheme(this.schemecode).subscribe(x => {
        this.schemeList.push(x.result);
        this.showDistrictDropDown = false;
        this.showCashTypeField = false;
        this.showKindTypeField = false;
        if (this.schemeList.length > 0) {
          this.isSchemeFound = true;
        } else {
          this.isSchemeFound = false;
          this.toastr.warning("No Scheme Mapped with this department");
        }
        //console.log(x.result);
      });
    }

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
      if (item.codeValueId.includes(key)) {
        finYear = item.codeValueDesc.trim();
      }
      //finYear = item.codeValueDesc.trim();
    });
    //console.log(key, finYear);
    return finYear;
  }

  updateFinYear(key: any) {
    let financialYear: string = "";
    financialYear = this.getFinYearFromId(key.value);
    this.dbtDataForm.patchValue({ financialYear: financialYear });
  }
  onSchemeChange(event: any) {
    this.reportingMonthList = [];
    let Id = event.value;
    //console.log(Id);


    this.monthService.GetCurrentMonth(Id).subscribe(x => {
      //this.reportingMonthList = x;
      this.curmonth = x;
      //console.log(this.curmonth);
      //console.log(this.curmonth.data[0]['get_current_month'] + 1);
      //this.recmonth = (this.curmonth.data[0]['get_current_month']);
      if (this.curmonth.data[0]['get_current_month'] == 12) {
        this.getmonthstart();
      }
      else if (this.curmonth.data[0]['get_current_month'] == null) {
        this.getStartMonth();
      }
      else {
        this.getmonth();
      }
      this.getTranstype(Id);
    });


    this.dbtDataService.GetLastMonthDbtData(Id, 1).subscribe(response => {

      this.wbJson = response.data;
      //console.log(this.wbJson);

      this.dataSource = new MatTableDataSource<getLastMonthData>(response.data);
      this.students = response.data;
      //console.log(response.data);
      //console.log(this.dataSource.filteredData);
    });

    this.dbtDataService.GetSchemeInformation(event.value, '2022-2023').subscribe(response => {
      //console.log(response['data'][0].get_scheme_information);
      if (response['data'][0].get_scheme_information > 0) {
        this.tableflag = false;
        this.tabledata = true;
      }
      else {
        this.tabledata = false;
        this.tableflag = true;
      }
    });
  }

  onKeyUp(event: any, index: any) {
    //console.log(this.wbJson[index].value);
    this.incval = this.wbJson[index].value + parseInt(event.target.value);
    this.a[index] = this.incval;
  }
  onKeyUpdefault(event: any, index: any) {
    //console.log(typeof this.defval[index].value);
    this.incval = parseInt(this.defval[index].value) + parseInt(event.target.value);
    this.a[index] = this.incval;
  }
  getmonth() {
    this.monthService.GetMonth(this.curmonth.data[0]['get_current_month'] + 1).subscribe(x => {
      // this.reportmonth = x;
      if (x.errorMessage == null)
        this.reportingMonthList.push(x.result);
      //console.log(this.reportingMonthList);
    });
  }
  getStartMonth() {
    this.monthService.GetMonth(4).subscribe(x => {
      // this.reportmonth = x;
      if (x.errorMessage == null)
        this.reportingMonthList.push(x.result);
      //console.log(this.reportingMonthList);
    });
  }
  getmonthstart() {
    this.monthService.GetMonth(1).subscribe(x => {
      // this.reportmonth = x;
      if (x.errorMessage == null)
        this.reportingMonthList.push(x.result);
      //console.log(this.reportingMonthList);
    });
  }

  getTranstype(Id: any) {
    this.dbtDataService.getTransType(Id).subscribe(response => {
      this.transtype = response;
      //console.log(this.transtype.data[0]['get_transfer_type']);
      this.transfertypebind();

    });
  }
  transfertypebind() {
    this.masterService.getCodeValueById(this.transtype.data[0]['get_transfer_type']).subscribe(response => {
      this.benefitTypeList1 = response;
      //console.log(this.benefitTypeList1);
    });
  }

  validateSum() {
    let fundTrnsferCash = this.dbtDataForm.get('fundTrnsferCash')?.value;
    let amntTrnsCashOther = this.dbtDataForm.get('amntTrnsCashOther')?.value;

    let amntTrnsCashElectronic = this.dbtDataForm.get('amntTrnsCashElectronic')?.value;
    //console.log(fundTrnsferCash,amntTrnsCashOther,amntTrnsCashElectronic);

    if (amntTrnsCashOther + amntTrnsCashElectronic !== fundTrnsferCash) {
      //console.log('Invalid sum');
    }
  }

  onSubmit() {
    this.dbtDataForm.patchValue({
      totalBen: this.a[0],
      totalBenWithBank: this.a[1],
      totalBenDigitized: this.a[2],
      benAadharSeeded: this.a[3],
      mobileCaptured: this.a[4],
    })
    this.dbtDataForm.value.financialYear = this.getFinYearFromId(this.dbtDataForm.value.finYrCode);
    // console.log(this.dbtDataForm.value.schemeCode, this.dbtDataForm.value.finYrCode, this.dbtDataForm.value.financialYear, this.financialYear.codeValueId);
    this.dbtDataService.GetSchemeInformation(this.dbtDataForm.value.schemeCode, this.dbtDataForm.value.financialYear).subscribe(response => {
      //console.log(response['data'][0].get_scheme_information);
      //debugger;
      if (response['data'][0].get_scheme_information > 0) {

        if (this.dbtDataForm.valid) {
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
      else {
        if (this.dbtDataForm.valid) {
          this.dbtDataService.InsertInIncremental(this.dbtDataForm.value).subscribe(response => {
            if (response.errorMessage != null) {
              // alert(response.errorMessage);
              this.toastr.error(response.errorMessage);

            }
          });

          this.dbtDataService.RegisterDBTData(this.dbtDataForm.value).subscribe(response => {
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
    });
  }
  draftSave() {
    //this.dialogRef.close('DBT Data Draft Successfully');

    this.dbtDataForm.patchValue({
      totalBen: this.a[0],
      totalBenWithBank: this.a[1],
      totalBenDigitized: this.a[2],
      benAadharSeeded: this.a[3],
      mobileCaptured: this.a[4],
    })
    this.dbtDataForm.value.financialYear = this.getFinYearFromId(this.dbtDataForm.value.finYrCode);
    this.dbtDataService.GetSchemeInformation(this.dbtDataForm.value.schemeCode, this.dbtDataForm.value.financialYear).subscribe(response => {
      //console.log(response['data'][0].get_scheme_information);
      //debugger;
      if (response['data'][0].get_scheme_information > 0) {

        if (this.dbtDataForm.valid) {
          //console.log("Inside If");
          this.dbtDataService.RegisterDBTDataIncremental(this.dbtDataForm.value).subscribe(response => {
            if (response.errorMessage != null) {
              // alert(response.errorMessage);
              this.toastr.error(response.errorMessage);

            } else {
              //this.toastr.success('');
              this.dialogRef.close('DBT Data Drafted Successfully');
            }
          });
        }
      }
      else {
        //console.log("Inside If");
        if (this.dbtDataForm.valid) {
          this.dbtDataService.InsertInIncremental(this.dbtDataForm.value).subscribe(response => {
            if (response.errorMessage != null) {
              // alert(response.errorMessage);
              this.toastr.error(response.errorMessage);

            }
          });

          this.dbtDataService.RegisterDraftDBTData(this.dbtDataForm.value).subscribe(response => {
            if (response.errorMessage != null) {
              // alert(response.errorMessage);
              this.toastr.error(response.errorMessage);

            } else {
              //this.toastr.success('');
              this.dialogRef.close('DBT Data Drafted Successfully');
            }
          });
        }
      }
    });

  }
}
