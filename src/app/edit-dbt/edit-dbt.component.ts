import { Component, Inject, ViewChild } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { District } from '../model/district.model';
import { Department } from '../model/department.model';
import { CodeValues } from '../model/code-values.model';
import { getLastMonthData, Scheme } from '../model/scheme.model';
import { Month } from '../model/month.model';
import { MatPaginator } from '@angular/material/paginator';
import { MasterService } from '../service/master.service';
import { DepartmentService } from '../service/department.service';
import { DistrictService } from '../service/district.service';
import { DbtdataService } from '../service/dbtdata.service';
import { SchemeService } from '../service/scheme.service';
import { MonthService } from '../service/month.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MasterCodeType } from '../../app_enum';
import { MatTableDataSource } from '@angular/material/table';
// Add this import if FromArrayHelper is defined elsewhere
import { FromArrayHelper } from '../helper/utils';

@Component({
  selector: 'app-edit-dbt',
  imports: [SharedModule],
  templateUrl: './edit-dbt.component.html',
  styleUrl: './edit-dbt.component.scss'
})
export class EditDbtComponent {


  incrementalData !: FromArrayHelper;



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
  isSchemeFound: boolean = true;
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
  firstTimeEntry: boolean = true;
  incrementaldata: any[] = [];
  dbtDataForm: FormGroup;
  defval = [
    { name: 'Total Beneficiary', value: '0' },
    { name: 'Total Beneficiary With Bank', value: '0' },
    { name: 'Total Beneficiary Digitized', value: '0' },
    { name: 'Beneficiary Aadhar Seeded', value: '0' },
    { name: 'Mobile Captured', value: '0' }
  ];
  a: any[] = [];

  datalist: any;
  deptCode: any;

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined

  constructor(private masterService: MasterService,
    private departmentService: DepartmentService,
    private districtService: DistrictService,
    private dbtDataService: DbtdataService,
    private schemeService: SchemeService,
    private monthService: MonthService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EditDbtComponent>,
    private fb: FormBuilder
  ) {
    this.dbtDataForm = new FormGroup({
      totalBen: new FormControl('', Validators.maxLength(5)),
      totalBenWithBank: new FormControl('', Validators.maxLength(10)),
      totalBenDigitized: new FormControl('', Validators.maxLength(10)),
      benAadharSeeded: new FormControl('', Validators.maxLength(10)),
      mobileCaptured: new FormControl('', Validators.maxLength(10)),
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
      id: new FormControl(),
      dbtstatus: new FormControl(),

      //---------------------
      //newly added Form control on 27_12_2023
      shgNumber: new FormControl(0),
      amntTrnsElectronicApb: new FormControl(),
      noOfTrnsElectronicApb: new FormControl(),

      totalBenIncremental: new FormControl(),
      benWithBankIncremental: new FormControl(),
      benDigitizedIncremental: new FormControl(),
      benAadharSeededIncremental: new FormControl(),
      mobileCapturedIncremental: new FormControl(),

      //----------------------

      incremetal: this.fb.array([]),
    });
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
    // debugger;
    //console.log(this.data.month);
    this.deptCode = localStorage.getItem('deptCode');

    this.schemecode = localStorage.getItem('schemeCode');
    //console.log(this.schemecode);

    //console.log(this.schemecode);
    let a = this.departmentService.encryptPassword(this.deptCode);
    //console.log(btoa(a));
    let enccd = btoa(a);

    if (this.schemecode == "" || this.schemecode == null) {
      this.schemeService.findActiveSchemes(this.deptCode).subscribe(x => {
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

    this.dbtDataService.getDbtidWiseData(this.data.eventData).subscribe(response => {
      this.datalist = response;
      console.log(this.datalist);
      console.log(this.datalist.data[0]['schemecode']);
      this.fun();
    });

    // this.dbtDataService.DbtDataForEdit(this.data.eventData).subscribe(response => {
    //   this.datalist = response.result;
    //   console.log(this.datalist);
    //   console.log(this.datalist.aadharTransKind);
    //   this.fun();
    // });

    //this.fun();
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

    if (this.deptCode == "" || this.deptCode == null) {
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

    this.masterService.getCodeValueById(50).subscribe(x => {
      this.dataUploadLevelList1 = x;
      //console.log(this.dataUploadLevelList1);
    });

  }
  fun() {
    //debugger;
    console.log(this.data);
    if (this.data.month == 4) {
      this.firstTimeEntry = true;

      //this.tableflag = true;
      this.tabledata = false;
      //this.tabledata=true;
      this.dataSource = this.defval;
      this.students = this.dataSource;
      //console.log(this.dataSource);

      this.dbtDataService.DbtDataForEdit(this.data.eventData).subscribe(response => {
        //this.tabledata = true;
        //this.tableflag = false;
        this.wbJson = response.result;
        console.log(this.wbJson);
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
        this.dataSource = new MatTableDataSource<getLastMonthData>(response.result);
        this.students = response.result;

        this.dbtDataForm.patchValue({
          id: this.data.eventData,
          //expenditureKind:"datalist.data[0]['expenditurekind']",
          // fundTrnsferCash: this.datalist.data[0]['fundtrnsfercash'],
          // //expenditureKind: this.datalist.data[0]['expenditurekind'],
          // noTrnsCashElectronic: this.datalist.data[0]['notrnscashelectronic'],
          // amntTrnsCashElectronic: this.datalist.data[0]['amnttrnscashelectronic'],
          // noTrnsCashOther: this.datalist.data[0]['notrnscashother'],
          // amntTrnsCashOther: this.datalist.data[0]['amnttrnscashother'],
          // trnsAadharSeeded: this.datalist.data[0]['trnsaadharseeded'],
          // noDeDuplicated: this.datalist.data[0]['nodeduplicated'],
          // noGhost: this.datalist.data[0]['noghost'],
          // otherSavings: this.datalist.data[0]['othersavings'],
          // savingAmnt: this.datalist.data[0]['savingamnt'],
          // remarks: this.datalist.data[0]['remarks'],
          // unitKind: this.datalist.data[0]['unitkind'],
          // qtyTransferedKind: this.datalist.data[0]['qtytransferedkind'],
          // aadharTransKind: this.datalist.data[0]['aadhartranskind'],

          //expenditureKind:"datalist.data[0]['expenditurekind']",
          fundTrnsferCash: this.wbJson.fundTrnsferCash,
          //expenditureKind: this.datalist.data[0]['expenditurekind'],
          noTrnsCashElectronic: this.wbJson.noTrnsCashElectronic,
          amntTrnsCashElectronic: this.wbJson.amntTrnsCashElectronic,
          noTrnsCashOther: this.wbJson.noTrnsCashOther,
          amntTrnsCashOther: this.wbJson.amntTrnsCashOther,
          trnsAadharSeeded: this.wbJson.trnsAadharSeeded,
          noDeDuplicated: this.wbJson.noDeDuplicated,
          noGhost: this.wbJson.noGhost,
          otherSavings: this.wbJson.otherSavings,
          savingAmnt: this.wbJson.savingAmnt,
          remarks: this.wbJson.remarks,
          unitKind: this.wbJson.unitKind,
          qtyTransferedKind: this.wbJson.qtyTransferedKind,
          aadharTransKind: this.wbJson.aadharTransKind,


          shgNumber: this.wbJson.numberOfGroupSHG,
          amntTrnsElectronicApb: this.wbJson.fundCashElectronicApb,
          noOfTrnsElectronicApb: this.wbJson.amntTrnsCashOther,


        });
      });

      // this.defval.forEach(element => {
      //   element.value = this.datalist.data[0]['fundtrnsfercash'];

      // });
    }
    else {
      //debugger;
      console.log(this.datalist.data[0]['schemecode']);
      this.dbtDataService.DbtDataForEdit(this.data.eventData).subscribe(response => {
        this.firstTimeEntry = false;
        this.tabledata = false;
        this.tableflag = true;
        this.wbJson = response.result;
        console.log(this.wbJson);

        this.incrementalData.fromGroupAt(0).patchValue({
          totalBen: this.wbJson.totalBenIncremental
        });
        this.incrementalData.fromGroupAt(1).patchValue({
          totalBen: this.wbJson.benWithBankIncremental
        });
        this.incrementalData.fromGroupAt(2).patchValue({
          totalBen: this.wbJson.benDigitizedIncremental
        });
        this.incrementalData.fromGroupAt(3).patchValue({
          totalBen: this.wbJson.benAadharSeededIncremental
        });
        this.incrementalData.fromGroupAt(4).patchValue({
          totalBen: this.wbJson.mobileCapturedIncremental
        });

        this.a[0] = this.wbJson.totalBen;
        this.a[1] = this.wbJson.totalBenWithBank;
        this.a[2] = this.wbJson.totalBenDigitized;
        this.a[3] = this.wbJson.benAadharSeeded;
        this.a[4] = this.wbJson.mobileCaptured;

        this.dataSource = new MatTableDataSource<getLastMonthData>(response.result);
        this.students = response.result;
        console.log(response.result);


        this.dbtDataForm.patchValue({
          id: this.data.eventData,
          // //expenditureKind:"datalist.data[0]['expenditurekind']",
          // fundTrnsferCash: this.datalist.data[0]['fundtrnsfercash'],
          // //expenditureKind: this.datalist.data[0]['expenditurekind'],
          // noTrnsCashElectronic: this.datalist.data[0]['notrnscashelectronic'],
          // amntTrnsCashElectronic: this.datalist.data[0]['amnttrnscashelectronic'],
          // noTrnsCashOther: this.datalist.data[0]['notrnscashother'],
          // amntTrnsCashOther: this.datalist.data[0]['amnttrnscashother'],
          // trnsAadharSeeded: this.datalist.data[0]['trnsaadharseeded'],
          // noDeDuplicated: this.datalist.data[0]['nodeduplicated'],
          // noGhost: this.datalist.data[0]['noghost'],
          // otherSavings: this.datalist.data[0]['othersavings'],
          // savingAmnt: this.datalist.data[0]['savingamnt'],
          // remarks: this.datalist.data[0]['remarks'],
          // unitKind: this.datalist.data[0]['unitkind'],
          // qtyTransferedKind: this.datalist.data[0]['qtytransferedkind'],
          // aadharTransKind: this.datalist.data[0]['aadhartranskind'],

          //expenditureKind:"datalist.data[0]['expenditurekind']",
          fundTrnsferCash: this.wbJson.fundTrnsferCash,
          //expenditureKind: this.datalist.data[0]['expenditurekind'],
          noTrnsCashElectronic: this.wbJson.noTrnsCashElectronic,
          amntTrnsCashElectronic: this.wbJson.amntTrnsCashElectronic,
          noTrnsCashOther: this.wbJson.noTrnsCashOther,
          amntTrnsCashOther: this.wbJson.amntTrnsCashOther,
          trnsAadharSeeded: this.wbJson.trnsAadharSeeded,
          noDeDuplicated: this.wbJson.noDeDuplicated,
          noGhost: this.wbJson.noGhost,
          otherSavings: this.wbJson.otherSavings,
          savingAmnt: this.wbJson.savingAmnt,
          remarks: this.wbJson.remarks,
          unitKind: this.wbJson.unitKind,
          qtyTransferedKind: this.wbJson.qtyTransferedKind,
          aadharTransKind: this.wbJson.aadharTransKind,

          shgNumber: this.wbJson.numberOfGroupSHG,
          amntTrnsElectronicApb: this.wbJson.fundCashElectronicApb,
          noOfTrnsElectronicApb: this.wbJson.amntTrnsCashOther,



          // totalBenIncremental: this.dbtDataForm.controls['incremetal'],
          // benWithBankIncremental: ,
          // benDigitizedIncremental: ,
          // benAadharSeededIncremental: ,
          // mobileCapturedIncremental: ,


        });

        //console.log(this.dataSource.filteredData);
      });

      // this.dbtDataService.GetLastMonthDbtData(this.datalist.data[0]['schemecode'], 2).subscribe(response => {
      //   this.tabledata = true;
      //   this.tableflag = false;
      //   this.wbJson = response.data;
      //  // console.log(this.wbJson);

      //   this.dataSource = new MatTableDataSource<getLastMonthData>(response.data);
      //   this.students = response.data;
      //   //console.log(response.data);
      //   //console.log(this.dataSource.filteredData);
      // });
    }

    // this.incrementaldata[0]=parseInt(this.wbJson.totalBen+this.wbJson.totalBenIncremental);
    // this.incrementaldata[1]=(this.wbJson.totalBen+this.wbJson.totalBenIncremental);
    // this.incrementaldata[2]=(this.wbJson.totalBen+this.wbJson.totalBenIncremental);
    // this.incrementaldata[3]=(this.wbJson.totalBen+this.wbJson.totalBenIncremental);
    // this.incrementaldata[4]=(this.wbJson.totalBen+this.wbJson.totalBenIncremental);
    //debugger;
    console.log(this.datalist.data[0]);
    if (this.datalist.data[0]['benefittype'] == 1) {
      this.showCashTypeField = true;
      this.showKindTypeField = false;
    }
    else if (this.datalist.data[0]['benefittype'] == 2) {
      this.showKindTypeField = true;
      this.showCashTypeField = false;
    }
    else if (this.datalist.data[0]['benefittype'] == 3) {
      this.showCashTypeField = true;
      this.showKindTypeField = true;
    }

  }
  get eventData() {
    return this.data.eventData;
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


  onKeyUp(event: any, index: any) {
    //console.log(this.wbJson[index].value);
    this.incval = this.wbJson[index].value + parseInt(event.target.value);
    this.a[index] = this.incval;
  }
  onKeyUpdefault(event: any, index: any) {
    console.log(typeof this.defval[index].value);
    this.incval = parseInt(this.a[index]) + parseInt(event.target.value);
    this.incrementaldata[index] = this.incval;
    console.log(this.incrementaldata);

  }

  onKeyUpFirstdefault(event: any, index: any) {
    this.incval = parseInt(event.target.value);
    this.a[index] = this.incval || 0;
    this.incrementaldata[index] = parseInt(event.target.value);
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

  onSubmit() {
    // this.dbtDataForm.patchValue({
    //   totalBen: this.a[0],
    //   totalBenWithBank: this.a[1],
    //   totalBenDigitized: this.a[2],
    //   benAadharSeeded: this.a[3],
    //   mobileCaptured: this.a[4],
    // });
    if (this.datalist.data[0]['monthname'] == "April") {
      this.dbtDataForm.patchValue({

        totalBen: this.dbtDataForm.value.incremetal[0].totalBen,
        totalBenWithBank: this.dbtDataForm.value.incremetal[1].totalBen,
        totalBenDigitized: this.dbtDataForm.value.incremetal[2].totalBen,
        benAadharSeeded: this.dbtDataForm.value.incremetal[3].totalBen,
        mobileCaptured: this.dbtDataForm.value.incremetal[4].totalBen,

        totalBenIncremental: this.dbtDataForm.value.incremetal[0].totalBen,
        benWithBankIncremental: this.dbtDataForm.value.incremetal[1].totalBen,
        benDigitizedIncremental: this.dbtDataForm.value.incremetal[2].totalBen,
        benAadharSeededIncremental: this.dbtDataForm.value.incremetal[3].totalBen,
        mobileCapturedIncremental: this.dbtDataForm.value.incremetal[4].totalBen,
      });

    }
    else {
      this.dbtDataForm.patchValue({

        totalBen: this.wbJson.totalBen + this.dbtDataForm.value.incremetal[0].totalBen,
        totalBenWithBank: this.wbJson.totalBenWithBank + this.dbtDataForm.value.incremetal[1].totalBen,
        totalBenDigitized: this.wbJson.totalBenDigitized + this.dbtDataForm.value.incremetal[2].totalBen,
        benAadharSeeded: this.wbJson.benAadharSeeded + this.dbtDataForm.value.incremetal[3].totalBen,
        mobileCaptured: this.wbJson.mobileCaptured + this.dbtDataForm.value.incremetal[4].totalBen,

        totalBenIncremental: this.dbtDataForm.value.incremetal[0].totalBen,
        benWithBankIncremental: this.dbtDataForm.value.incremetal[1].totalBen,
        benDigitizedIncremental: this.dbtDataForm.value.incremetal[2].totalBen,
        benAadharSeededIncremental: this.dbtDataForm.value.incremetal[3].totalBen,
        mobileCapturedIncremental: this.dbtDataForm.value.incremetal[4].totalBen,
      });
    }


    //DBTEditDataModel
    this.dbtDataForm.value.financialYear = this.getFinYearFromId(this.dbtDataForm.value.finYrCode);
    console.log(this.dbtDataForm.value);
    this.dbtDataService.SaveEditedDbtData(this.dbtDataForm.value).subscribe(response => {
      if (response.errorMessage != null) {
        // alert(response.errorMessage);
        this.toastr.error(response.errorMessage);
      } else {
        //this.toastr.success('');
        this.dialogRef.close('DBT Data Edited Successfully');
      }
    });
  }
}
