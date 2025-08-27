import { Component, ViewChild } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FromArrayHelper } from '../../helper/utils';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { District } from '../../model/district.model';
import { Department } from '../../model/department.model';
import { CodeValues } from '../../model/code-values.model';
import { getLastMonthData, Scheme } from '../../model/scheme.model';
import { Month } from '../../model/month.model';
import { MatPaginator } from '@angular/material/paginator';
import { MasterService } from '../../service/master.service';
import { DepartmentService } from '../../service/department.service';
import { DbtdataService } from '../../service/dbtdata.service';
import { DistrictService } from '../../service/district.service';
import { SchemeService } from '../../service/scheme.service';
import { MonthService } from '../../service/month.service';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../../service/notification.service';
import { MatDialogRef } from '@angular/material/dialog';
import { DataUploadLevelType, MasterCodeType, Transfer_Type } from '../../../app_enum';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-add-dbtdata-newformat',
  imports: [SharedModule],
  templateUrl: './add-dbtdata-newformat.component.html',
  styleUrl: './add-dbtdata-newformat.component.scss'
})
export class AddDbtdataNewformatComponent {


  incrementalData !: FromArrayHelper;

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
  public array: any;
  currentPage: number = 0;
  pageSize: number = 5;
  totalSize: number = 0;
  tableflag: boolean = false;
  tabledata: boolean = false;
  firstTimeEntry: boolean = true;
  wbJson: any;
  defval = [
    { name: 'Total Beneficiary', val: '0' },
    { name: 'Total Beneficiary With Bank', val: '0' },
    { name: 'Total Beneficiary Digitized', val: '0' },
    { name: 'Beneficiary Aadhar Seeded', val: '0' },
    { name: 'Mobile Captured', val: '0' }
  ];
  a: any[] = [];
  incrementaldata: any[] = [];


  @ViewChild(MatPaginator) paginator: MatPaginator | undefined
  constructor(private masterService: MasterService,
    private departmentService: DepartmentService,
    private districtService: DistrictService,
    private dbtDataService: DbtdataService,
    private schemeService: SchemeService,
    private monthService: MonthService,
    private toastr: ToastrService,

    private notify: NotificationService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddDbtdataNewformatComponent>
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
      noDeDuplicated: new FormControl(0),
      noGhost: new FormControl(0),
      otherSavings: new FormControl(0),
      savingAmnt: new FormControl(0),
      remarks: new FormControl(),
      increaseData: new FormControl(),
      //newly added Form control on 27_12_2023
      shgNumber: new FormControl(0),
      amntTrnsElectronicApb: new FormControl(),
      noOfTrnsElectronicApb: new FormControl(),

      totalBenIncremental: new FormControl(),
      benWithBankIncremental: new FormControl(),
      benDigitizedIncremental: new FormControl(),
      benAadharSeededIncremental: new FormControl(),
      mobileCapturedIncremental: new FormControl(),


      incremetal: this.fb.array([])


    })
  }

  ngOnInit(): void {

    this.incrementalData = new FromArrayHelper(this.dbtDataForm.controls['incremetal'], {
      name: ['', Validators.required],
      prevben: [''],
      totalBen: ['', Validators.required],
      sumben: [''],
    });
    for (let index = 0; index < 5; index++) {
      this.incrementalData.addControl();
    }
    // deb
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
      //console.log(this.financialYear);
    });

    if (deptCode == "" || deptCode == null) {
      this.departmentService.getDepartments().subscribe(x => {
        this.departmentList = x;
        //console.log(this.departmentList);
      });
    } else {
      this.departmentService.GetDepartment(enccd).subscribe(x => {
        if (x.errorMessage == null)
          this.departmentList.push(x.result);
        //console.log(this.departmentList);
      });
    }

    this.masterService.getCodeValueById(50).subscribe(x => {
      this.dataUploadLevelList1 = x;
      console.log(this.dataUploadLevelList1);
    });

  }

  onDepartmentChange(event: any) {
    //console.log(this.schemecode);

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
        //console.log(this.schemeList);

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
    this.dbtDataForm.patchValue({

      fundTrnsferCash: 0,
      expenditureKind: 0,
      noTrnsCashElectronic: 0,
      amntTrnsCashElectronic: 0,
      noTrnsCashOther: 0,
      amntTrnsCashOther: 0,
      trnsAadharSeeded: 0,
      unitKind: 0,
      qtyTransferedKind: 0,
      aadharTransKind: 0,
      noDeDuplicated: 0,
      noGhost: 0,
      otherSavings: 0,
      savingAmnt: 0,
      amntTrnsElectronicApb: 0,
      noOfTrnsElectronicApb: 0,
    })

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
    });
    return finYear;
  }

  updateFinYear(key: any) {
    let financialYear: string = "";
    financialYear = this.getFinYearFromId(key.value);
    this.dbtDataForm.patchValue({ financialYear: financialYear });
  }
  onMonthChange(event: any) {
    let id = event.value;
    if (id == 4) {
      this.firstTimeEntry = true;
    } else {
      this.firstTimeEntry = false;
    }

  }
  onSchemeChange(event: any) {
    this.reportingMonthList = [];
    let Id = event.value;
    //console.log(Id);

    //debugger;
    this.monthService.GetCurrentMonth(Id).subscribe(x => {
      this.curmonth = x;
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
      //console.log(response['data']);
      //console.log(Id);

      console.log(response.data);

      // if (response.data[5].val != 999) {
      //   this.dialogRef.close("Previous Month Data is not pushed to Bharat DBT!");
      //   //this.notify.notification('Previous Month Data is not pushed to Bharat DBT!');
      // }

      //console.log("Value: " + response.data[5].val);
      //console.log(response.data);
      //debugger;
      this.wbJson = response.data;
      console.log(this.wbJson[0].value);

      this.incrementalData.fromGroupAt(0).patchValue({
        totalBen: this.wbJson.totalBen
      });
      this.incrementalData.fromGroupAt(1).patchValue({
        totalBen: this.wbJson.totalBenWithBank
      });
      this.incrementalData.fromGroupAt(2).patchValue({
        totalBen: this.wbJson.totalBenDigitized
      });
      this.incrementalData.fromGroupAt(3).patchValue({
        totalBen: this.wbJson.benAadharSeeded
      });
      this.incrementalData.fromGroupAt(4).patchValue({
        totalBen: this.wbJson.mobileCaptured
      });
      console.log(this.incrementalData.fromGroupAt(0));

      this.a[0] = this.wbJson[0].value;
      this.a[1] = this.wbJson[1].value;
      this.a[2] = this.wbJson[2].value;
      this.a[3] = this.wbJson[3].value;
      this.a[4] = this.wbJson[4].value;
      console.log(this.a[0]);


      this.dataSource = new MatTableDataSource<getLastMonthData>(response.data);
    });

    this.dbtDataService.GetSchemeInformation(event.value, '2024-2025').subscribe(response => {
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
    this.incval = this.wbJson[index].value + parseInt(event.target.value);
    this.a[index] = this.incval || 0;
    this.incrementaldata[index] = parseInt(event.target.value);
  }
  onKeyUpdefault(event: any, index: any) {
    this.incval = parseInt(this.wbJson[index].value) + parseInt(event.target.value);
    //this.a[index] = this.incval || 0;
    this.incrementaldata[index] = this.incval;
  }

  onKeyUpFirstdefault(event: any, index: any) {
    this.incval = parseInt(event.target.value);
    this.a[index] = this.incval || 0;
    this.incrementaldata[index] = parseInt(event.target.value);
  }
  getmonth() {
    this.monthService.GetMonth(this.curmonth.data[0]['get_current_month'] + 1).subscribe(x => {
      if (x.errorMessage == null)
        this.reportingMonthList.push(x.result);
    });
  }
  getStartMonth() {
    this.monthService.GetMonth(4).subscribe(x => {
      if (x.errorMessage == null)
        this.reportingMonthList.push(x.result);
    });
  }
  getmonthstart() {
    this.monthService.GetMonth(1).subscribe(x => {
      if (x.errorMessage == null)
        this.reportingMonthList.push(x.result);
    });
  }

  getTranstype(Id: any) {
    this.dbtDataService.getTransType(Id).subscribe(response => {
      this.transtype = response;
      this.transfertypebind();

    });
  }
  transfertypebind() {
    this.masterService.getCodeValueById(this.transtype.data[0]['get_transfer_type']).subscribe(response => {
      this.benefitTypeList1 = response;
    });
  }

  validateSum() {
    let fundTrnsferCash = this.dbtDataForm.get('fundTrnsferCash')?.value;
    let amntTrnsCashOther = this.dbtDataForm.get('amntTrnsCashOther')?.value;
    let amntTrnsCashElectronic = this.dbtDataForm.get('amntTrnsCashElectronic')?.value;
    if (amntTrnsCashOther + amntTrnsCashElectronic !== fundTrnsferCash) {
      //console.log('Invalid sum');
    }
  }

  onSubmit() {
    //console.log(this.a);
    //console.log(this.incrementaldata);

    this.notify.confirmProposal('Are you sure ?', 'Do you really want to entry the Data?').then((res) => {
      if (res) {

        console.log(this.a[0]);
        console.log(this.incrementaldata[0]);


        this.dbtDataForm.patchValue({
          totalBen: this.a[0],
          totalBenWithBank: this.a[1],
          totalBenDigitized: this.a[2],
          benAadharSeeded: this.a[3],
          mobileCaptured: this.a[4],

          totalBenIncremental: this.incrementaldata[0],
          benWithBankIncremental: this.incrementaldata[1],
          benDigitizedIncremental: this.incrementaldata[2],
          benAadharSeededIncremental: this.incrementaldata[3],
          mobileCapturedIncremental: this.incrementaldata[4],
        })
        this.dbtDataForm.value.financialYear = this.getFinYearFromId(this.dbtDataForm.value.finYrCode);

        console.log(this.dbtDataForm.value);
        console.log(this.dbtDataForm.valid);


        if (this.dbtDataForm.valid) {
          this.dbtDataService.RegisterDBTDataNewFormat(this.dbtDataForm.value).subscribe(response => {
            if (response.errorMessage != null) {
              this.toastr.error(response.errorMessage);
            } else {
              this.dialogRef.close('DBT Data Saved Successfully');
            }
          });
        }
      }
    });

  }
  draftSave() {

    this.notify.confirmProposal('Are you sure ?', 'Do you really want to entry the Data as a Draft?').then((res) => {
      if (res) {

        this.dbtDataForm.patchValue({
          totalBen: this.a[0],
          totalBenWithBank: this.a[1],
          totalBenDigitized: this.a[2],
          benAadharSeeded: this.a[3],
          mobileCaptured: this.a[4],

          totalBenIncremental: this.incrementaldata[0],
          benWithBankIncremental: this.incrementaldata[1],
          benDigitizedIncremental: this.incrementaldata[2],
          benAadharSeededIncremental: this.incrementaldata[3],
          mobileCapturedIncremental: this.incrementaldata[4],
        })
        this.dbtDataForm.value.financialYear = this.getFinYearFromId(this.dbtDataForm.value.finYrCode);

        if (this.dbtDataForm.valid) {
          this.dbtDataService.RegisterDraftDBTData(this.dbtDataForm.value).subscribe(response => {
            if (response.errorMessage != null) {
              this.toastr.error(response.errorMessage);
            } else {
              this.dialogRef.close('DBT Data Drafted Successfully');
            }
          });
        }

        this.dbtDataService.GetSchemeInformation(this.dbtDataForm.value.schemeCode, this.dbtDataForm.value.financialYear).subscribe(response => {
          // if (response['data'][0].get_scheme_information > 0) {

          //   if (this.dbtDataForm.valid) {
          //     //console.log("Inside If");
          //     this.dbtDataService.RegisterDBTDataIncremental(this.dbtDataForm.value).subscribe(response => {
          //       if (response.errorMessage != null) {
          //         this.toastr.error(response.errorMessage);

          //       } else {
          //         this.dialogRef.close('DBT Data Drafted Successfully');
          //       }
          //     });
          //   }
          // }
          // else {
          //   //console.log("Inside If");
          //   if (this.dbtDataForm.valid) {
          //     this.dbtDataService.InsertInIncremental(this.dbtDataForm.value).subscribe(response => {
          //       if (response.errorMessage != null) {
          //         this.toastr.error(response.errorMessage);
          //       }
          //     });

          //     this.dbtDataService.RegisterDraftDBTData(this.dbtDataForm.value).subscribe(response => {
          //       if (response.errorMessage != null) {
          //         this.toastr.error(response.errorMessage);

          //       } else {
          //         this.dialogRef.close('DBT Data Drafted Successfully');
          //       }
          //     });
          //   }
          // }
        });

      }
    });


  }

}
