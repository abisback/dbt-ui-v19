import { Component, ElementRef, ViewChild } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { MatTableDataSource } from '@angular/material/table';
import { DBTData } from '../../model/dbtdata.model';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Department } from '../../model/department.model';
import { Month } from '../../model/month.model';
import { Scheme } from '../../model/scheme.model';
import { CodeValues } from '../../model/code-values.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DbtdataService } from '../../service/dbtdata.service';
import { SchemeService } from '../../service/scheme.service';
import { MonthService } from '../../service/month.service';
import { MasterService } from '../../service/master.service';
import { DepartmentService } from '../../service/department.service';
import { MasterCodeType } from '../../../app_enum';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-report-of-push-data',
  imports: [SharedModule],
  templateUrl: './report-of-push-data.component.html',
  styleUrl: './report-of-push-data.component.scss',
})
export class ReportOfPushDataComponent {
  // dataSource: MatTableDataSource<DBTData> = new MatTableDataSource<DBTData>([]);
  // totalRecords = 0;
  // // pageSize = 10;

  // deptcode = 101; // example
  // schemecode = 501; // example
  // finyr = 2025;
  // month = 8;

  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  // @ViewChild(MatSort) sort!: MatSort;

  // // dbtDataForm = new FormGroup({
  // //   deptCode: new FormControl(),
  // //   monthId: new FormControl(),
  // // });

  // loadingFlag: boolean = false;
  // displayedColumns: string[] = [
  //   'SerialNo',
  //   'Deptname',
  //   'SchemeName',
  //   'no_of_state_central',
  //   'no_of_state',
  //   'TotalBen',
  //   'TotalBenDigitized',
  //   'BenAadharSeeded',
  //   'MobileCaptured',
  //   'central_share',
  //   'state_share',
  //   'add_state_contribution',
  //   'state_contribution_for_additional',
  //   'FundTrnsferCash',
  //   'aa',
  //   'ab',
  //   'ac',
  //   'ad',
  //   'ae',
  //   'notrnscashelectronic',
  //   'amnttrnscashelectronic',
  //   'notrnscashother',
  //   'amnttrnscashother',
  //   'unitkind',
  //   'qtytransferedkind',
  //   'aadhartranskind',
  //   'cd',
  //   'nodeduplicated',
  //   'noghost',
  //   'othersavings',
  //   'savingamnt',
  // ];
  // // dataSource: any;
  // schemeCode: any;
  // currentPage: number = 0;
  // pageSize: number = 5;
  // totalSize: number = 0;
  // pageNumber = 1;
  // departmentList: any[] = [];
  // copyDepartmentList: Department[] = [];
  // monthList: Month[] = [];
  // isSchemeFound: boolean = false;
  // tableflag: boolean = false;
  // public array: any;
  // deptCode: any;
  // selectedCatlog: any;
  // name: any;
  // monthName: any;
  // showMyContainer: boolean = false;
  // math = Math;
  // deptname: any;
  // monthname: any;
  // deptindex: any;
  // monthindex: any;
  // reportData: any[] = [];
  // schemeList: Scheme[] = [];
  // copySchemeList: Scheme[] = [];
  // finYrList: CodeValues[] = [];
  // DeptCode: number = 0;
  // SchemeCode: number = 0;
  // MonthId: number = 0;
  // FinYrCode: number = 0;
  // dbtDataForm!: FormGroup;

  // // @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  // @ViewChild('TABLE') table: ElementRef | undefined;

  // constructor(
  //   private dbtDataService: DbtdataService,
  //   private schemeService: SchemeService,
  //   private monthService: MonthService,
  //   private masterService: MasterService,
  //   private departmentService: DepartmentService,
  //   private fb: FormBuilder
  // ) {}

  // ngOnInit(): void {
  //   this.dbtDataForm = this.fb.group({
  //     deptCode: [0],
  //     monthId: [0],
  //     schemeCode: [0],
  //     finYrCode: [0],
  //   });

  //   this.departmentService.getDepartments().subscribe((x) => {
  //     //this.departmentList = x;
  //     this.departmentList.push({ name: 'All', deptCode: 0 });
  //     x.forEach((elm) => {
  //       this.departmentList.push(elm);
  //     });
  //     // If you want to COPY this list elsewhere
  //     this.copyDepartmentList = [...this.departmentList];
  //     // console.log(x);
  //   });

  //   this.masterService
  //     .getCodeValues(MasterCodeType.Financial_Year)
  //     .subscribe((x) => {
  //       this.finYrList.push({
  //         Id: 0,
  //         codeTypeId: 0,
  //         codeValueDesc: 'ALL',
  //         codeValueId: '0',
  //       });
  //       x.forEach((elm) => {
  //         this.finYrList.push(elm);
  //       });
  //     });

  //   this.monthService.getMonths().subscribe((x) => {
  //     this.monthList.push({
  //       isActive: true,
  //       lastDay: 0,
  //       monthCode: '',
  //       monthId: 0,
  //       monthName: 'ALL',
  //       orderSeq: 1,
  //     });
  //     x.forEach((elm) => {
  //       this.monthList.push(elm);
  //     });
  //   });

  //   // const payload = {
  //   //   "pageNumber": 1,
  //   //   "pageSize": 5
  //   // }

  //   // this.dbtDataService.GetReportPushDataPaged(0, 0, 0, 0, payload).subscribe(x => {
  //   //   this.reportData = x.result.data;
  //   //   this.dataSource = new MatTableDataSource<ReportOfPushDataComponent>(x.result.data);
  //   //   this.dataSource.paginator = this.paginator;
  //   //   this.array = x.data;
  //   //   this.totalSize = this.array.length;
  //   // });
  //   this.loadTableData();
  // }

  // // ngAfterViewInit(): void {
  // //   this.paginator.page.subscribe(() => {
  // //     this.loadTableData();
  // //   });
  // // }

  // // loadTableData(pageIndex: number, pageSize: number): void {
  // //   const payload = {
  // //     pageNumber: pageIndex + 1, // API pages often start at 1
  // //     pageSize: pageSize
  // //   };

  // //   this.dbtDataService.GetReportPushDataPaged(0, 0, 0, 0, payload).subscribe(x => {
  // //     this.reportData = x.result.data;
  // //     this.dataSource = new MatTableDataSource<ReportOfPushDataComponent>(x.result.data);
  // //     this.dataSource.paginator = this.paginator;
  // //     this.array = x.data;
  // //     this.totalSize = x.result.totalCount;
  // //   });
  // // }

  // loadTableData() {
  //   const payload = {
  //     pageNumber: this.pageNumber,
  //     pageSize: this.pageSize,
  //   };

  //   // console.log(payload);

  //   this.dbtDataService
  //     .GetReportPushDataPaged(
  //       // this.DeptCode,
  //       this.dbtDataForm.value.deptCode || 0,
  //       this.dbtDataForm.value.schemeCode || 0,
  //       this.dbtDataForm.value.finYrCode || 0,
  //       this.dbtDataForm.value.monthCode || 0,
  //       payload
  //     )
  //     .subscribe((x) => {
  //       // this.dataSource = new MatTableDataSource<DBTData>(x.result.data);
  //       // this.dataSource.paginator = this.paginator; // still needed for UI
  //       // this.totalSize = x.result.totalCount; // ✅ correct total from API
  //       if (!this.dataSource) {
  //         this.dataSource = new MatTableDataSource<DBTData>([]);
  //         // this.dataSource.paginator = this.paginator; // set only once
  //       }
  //       // Always set custom sorting accessor (override MatTableDataSource default)
  //       this.dataSource.sortingDataAccessor = (item: any, property: string) => {
  //         const toNumber = (val: any): number => {
  //           const n = Number(val);
  //           return isNaN(n) ? 0 : n;
  //         };
  //         const toStringLower = (val: any): string =>
  //           (val ?? '').toString().toLowerCase();

  //         switch (property) {
  //           case 'SerialNo':
  //             return toNumber(item?.id);
  //           case 'Deptname':
  //             return toStringLower(item?.deptName);
  //           case 'SchemeName':
  //             return toStringLower(item?.schemeName);
  //           case 'no_of_state_central':
  //             return toNumber(item?.totalBen);
  //           case 'no_of_state':
  //             return 0;
  //           case 'TotalBen':
  //             return toNumber(item?.totalBen);
  //           case 'TotalBenDigitized':
  //             return toNumber(item?.totalBenDigitized);
  //           case 'BenAadharSeeded':
  //             return toNumber(item?.benAadharSeeded);
  //           case 'MobileCaptured':
  //             return toNumber(item?.mobileCaptured);
  //           case 'central_share':
  //             return toNumber(item?.fundCashCentre ?? item?.centralShare);
  //           case 'state_share':
  //             return toNumber(item?.fundCashState ?? item?.stateShare);
  //           case 'add_state_contribution':
  //             return toNumber(
  //               item?.fundCashStateAdditional ?? item?.additionalStateShare
  //             );
  //           case 'state_contribution_for_additional':
  //             return toNumber(item?.fundCashStateY);
  //           case 'FundTrnsferCash':
  //             return toNumber(item?.fundTrnsferCash);
  //           case 'aa':
  //             return toNumber(item?.expenditureKindCentre);
  //           case 'ab':
  //             return toNumber(item?.expenditureKindState);
  //           case 'ac':
  //             return toNumber(item?.expenditureKindStateY);
  //           case 'ad':
  //             return toNumber(item?.expenditureKindStateY);
  //           case 'ae':
  //             return toNumber(item?.expenditureKind);
  //           case 'notrnscashelectronic':
  //             return toNumber(item?.noTrnsCashElectronic);
  //           case 'amnttrnscashelectronic':
  //             return toNumber(item?.amntTrnsCashElectronic);
  //           case 'notrnscashother':
  //             return toNumber(item?.noTrnsCashOther);
  //           case 'amnttrnscashother':
  //             return toNumber(item?.amntTrnsCashOther);
  //           case 'unitkind':
  //             return toStringLower(item?.unitKind);
  //           case 'qtytransferedkind':
  //             return toNumber(item?.qtyTransferedKind);
  //           case 'aadhartranskind':
  //             return toNumber(item?.aadhartranskind ?? item?.aadharTransKind);
  //           case 'cd':
  //             return 0;
  //           case 'nodeduplicated':
  //             return toNumber(item?.noDeDuplicated);
  //           case 'noghost':
  //             return toNumber(item?.noGhost);
  //           case 'othersavings':
  //             return toNumber(item?.otherSavings);
  //           case 'savingamnt':
  //             return toNumber(item?.savingAmnt);
  //           default:
  //             return item[property as keyof typeof item];
  //         }
  //       };
  //       this.dataSource.data = x.result.data; // update data only
  //       this.totalSize = x.result.totalCount; // comes from API
  //       this.currentPage = 0;
  //       setTimeout(() => {
  //         if (this.paginator) {
  //           this.dataSource.paginator = this.paginator;
  //           this.paginator.firstPage();
  //         }
  //         if (this.sort) {
  //           this.dataSource.sort = this.sort;
  //         }
  //       });
  //     });
  // }

  // onSchemeSelect(e: any, schemeId: any) {
  //   this.dbtDataForm.value.schemeCode = schemeId;
  //   //console.log(roleId);
  //   if (e.isUserInput) {
  //     this.SchemeCode = schemeId; // this.dbtDataForm.value.schemeCode;
  //     // const payload = {
  //     //   "pageNumber": 1,
  //     //   "pageSize": 10
  //     // };

  //     this.loadTableData();

  //     // this.dbtDataService.GetReportPushDataPaged(this.dbtDataForm.value.deptCode ? this.dbtDataForm.value.deptCode : 0, schemeId,
  //     //   this.dbtDataForm.value.finYrCode ? this.dbtDataForm.value.finYrCode : 0,
  //     //   this.dbtDataForm.value.monthCode ? this.dbtDataForm.value.monthCode : 0, payload).subscribe(x => {
  //     //     //console.log(x.result);

  //     //     this.dataSource = new MatTableDataSource<DBTData>(x.result.data);
  //     //     //console.log(this.dataSource);
  //     //     this.dataSource.paginator = this.paginator;
  //     //     this.array = x;
  //     //     this.totalSize = this.array.length;
  //     //   });
  //   }
  // }

  // onFinancialYearSelect(e: any, finyrcode: any) {
  //   this.dbtDataForm.value.finYrCode = finyrcode;
  //   if (e.isUserInput) {
  //     this.FinYrCode = finyrcode; // this.dbtDataForm.value.finYrCode;
  //     // const payload = {
  //     //   "pageNumber": 1,
  //     //   "pageSize": 20
  //     // };

  //     this.loadTableData();
  //     // this.dbtDataService.GetReportPushDataPaged
  //     //   (this.dbtDataForm.value.deptCode ? this.dbtDataForm.value.deptCode : 0, this.dbtDataForm.value.schemeCode ? this.dbtDataForm.value.schemeCode : 0,
  //     //     finyrcode,
  //     //     this.dbtDataForm.value.monthCode ? this.dbtDataForm.value.monthCode : 0, payload).subscribe(x => {
  //     //       //console.log(x.result);

  //     //       this.dataSource = new MatTableDataSource<DBTData>(x.result.data);
  //     //       //console.log(this.dataSource);
  //     //       this.dataSource.paginator = this.paginator;
  //     //       this.array = x;
  //     //       this.totalSize = this.array.length;
  //     //     });
  //   }
  // }

  // onMonthSelect(e: any, monthcode: any) {
  //   this.dbtDataForm.value.monthCode = monthcode;
  //   if (e.isUserInput) {
  //     this.MonthId = monthcode; // this.dbtDataForm.value.monthCode;
  //     // const payload = {
  //     //   "pageNumber": 1,
  //     //   "pageSize": 20
  //     // }

  //     this.loadTableData();

  //     // this.dbtDataService.GetReportPushDataPaged
  //     //   (this.dbtDataForm.value.deptCode ? this.dbtDataForm.value.deptCode : 0, this.dbtDataForm.value.schemeCode ? this.dbtDataForm.value.schemeCode : 0,
  //     //     this.dbtDataForm.value.finYrCode ? this.dbtDataForm.value.finYrCode : 0,
  //     //     monthcode, payload).subscribe(x => {
  //     //       //console.log(x.result);
  //     //       this.dataSource = new MatTableDataSource<DBTData>(x.result.data);
  //     //       //console.log(this.dataSource);
  //     //       this.dataSource.paginator = this.paginator;
  //     //       this.array = x;
  //     //       this.totalSize = this.array.length;
  //     //     });
  //   }
  // }

  // onDepartmentSelect(e: any, deptcode: any) {
  //   this.dbtDataForm.value.deptCode = deptcode;
  //   //console.log(e);
  //   if (e.isUserInput) {
  //     this.dbtDataForm.get('schemeCode')?.reset();
  //     this.schemeList = [];
  //     this.DeptCode = deptcode;
  //     this.schemeService.findActiveSchemes(deptcode).subscribe((x) => {
  //       //console.log(x);
  //       if (x.length > 0) {
  //         this.schemeList.push({
  //           id: 0,
  //           deptCode: 0,
  //           deptName: '',
  //           schemeType: 0,
  //           schemeName: 'ALL',
  //           schemeCode: '',
  //           dbtSchemeCode: '',
  //           transferType: '',
  //           fundingPattern: '',
  //           centralShare: 0,
  //           stateShare: 0,
  //           additionalStateShare: 0,
  //           dbtSchemeCode_B: '',
  //           dbtSchemeCode_C: '',
  //           dbtSchemeCode_E: '',
  //           onBoarded: false,
  //           progress: 0,
  //           mISIntegrated: false,
  //           isActive: false,
  //         });
  //         x.forEach((elm) => {
  //           this.schemeList.push(elm);
  //         });
  //       }
  //       // this.schemeList = this.copySchemeList = x;
  //       //this.iterator();
  //     });

  //     // const payload = {
  //     //   "pageNumber": 1,
  //     //   "pageSize": 20
  //     // }

  //     // this.dbtDataService.GetReportPushDataPaged
  //     //   (deptcode, this.dbtDataForm.value.schemeCode ? this.dbtDataForm.value.schemeCode : 0,
  //     //     this.dbtDataForm.value.finYrCode ? this.dbtDataForm.value.finYrCode : 0,
  //     //     this.dbtDataForm.value.monthCode ? this.dbtDataForm.value.monthCode : 0, payload).subscribe(x => {
  //     //       //console.log(x.result);
  //     //       this.dataSource = new MatTableDataSource<DBTData>(x.result.data);
  //     //       //console.log(this.dataSource);
  //     //       this.dataSource.paginator = this.paginator;
  //     //       this.array = x.result.data;
  //     //       this.totalSize = this.array.length;
  //     //     });
  //     this.loadTableData();
  //   }
  // }

  // public saveToExcel() {
  //   const payload = {
  //     pageNumber: this.pageNumber, // 1, // Adjust as needed
  //     pageSize: this.pageSize, // 20 // Adjust as needed
  //   };
  //   this.dbtDataService
  //     .GetReportPushDataPaged(
  //       this.DeptCode,
  //       this.SchemeCode,
  //       this.FinYrCode,
  //       this.MonthId,
  //       payload
  //     )
  //     .subscribe((x) => {
  //       // console.log(x);

  //       let dataToExport = x.result.data;
  //       const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
  //       const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //       XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  //       XLSX.writeFile(
  //         wb,
  //         'Report_of_Pushed_data' + Date().valueOf() + '.xlsx'
  //       );
  //     });
  //   // const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource);
  //   // const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table?.nativeElement);
  //   // const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //   // XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  //   // XLSX.writeFile(wb, 'Report_of_Pushed_data' + Date().valueOf() + '.xlsx');
  // }
  // saveFilterExcel() {
  //   const deptcode = this.dbtDataForm.value.deptCode || 0;
  //   const schemecode = this.dbtDataForm.value.schemeCode || 0;
  //   const finyr = this.dbtDataForm.value.finYrCode || 0;
  //   const month = this.dbtDataForm.value.monthId || 0;
  //   // console.log(deptcode,schemecode,finyr, month);
  //   this.dbtDataService
  //     .GetReportPushData(deptcode, schemecode, finyr, month)
  //     .subscribe((x) => {
  //       let dataToExport = x.result;
  //       const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
  //       const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //       XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  //       XLSX.writeFile(
  //         wb,
  //         'Report_of_Pushed_data' + Date().valueOf() + '.xlsx'
  //       );
  //     });
  // }

  // public exportAllToExcel() {
  //   this.dbtDataService.GetReportPushData(0, 0, 0, 0).subscribe((x) => {
  //     // console.log(x);

  //     let dataToExport = x.result;
  //     const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
  //     const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  //     XLSX.writeFile(wb, 'Report_of_Pushed_data' + Date().valueOf() + '.xlsx');
  //   });
  // }
  // onSubmit() {}

  // // public handlePage(e: any) {
  // //   this.currentPage = e.pageIndex;
  // //   this.pageSize = e.pageSize;
  // //   this.iterator();
  // // }

  // onPageChange(event: PageEvent) {
  //   // console.log('Page changed:', event);

  //   this.pageNumber = event.pageIndex + 1;
  //   this.pageSize = event.pageSize;
  //   this.loadTableData();
  // }

  // private iterator() {
  //   const end = (this.currentPage + 1) * this.pageSize;
  //   const start = this.currentPage * this.pageSize;
  //   const part = this.array.slice(start, end);
  //   this.dataSource = part;
  // }

  // searchScheme(e: any) {
  //   if (e !== undefined) {
  //     let term = '';
  //     if (e.target.value.length > 0) {
  //       term = e.target.value;
  //     }
  //     if (term !== undefined && term !== '' && term != null) {
  //       if (term.length > 0) {
  //         this.schemeList = this.copySchemeList.filter((x: any) =>
  //           x.schemeName.toLowerCase().includes(term.toLowerCase())
  //         );
  //       } else {
  //         this.schemeList = this.copySchemeList;
  //       }
  //     } else {
  //       this.schemeList = this.copySchemeList;
  //     }
  //   }
  // }

  // displaySchemeFn(scheme: Scheme): string {
  //   const sc = this.schemeList?.find((s: any) => s.id === scheme);
  //   return sc ? sc.schemeName : '';
  // }
  // searchDept(e: any) {
  //   if (e !== undefined) {
  //     let term = '';
  //     if (e.target.value.length > 0) {
  //       term = e.target.value;
  //     }
  //     if (term !== undefined && term !== '' && term != null) {
  //       if (term.length > 0) {
  //         this.departmentList = this.copyDepartmentList.filter((x: any) =>
  //           x.name.toLowerCase().includes(term.toLowerCase())
  //         );
  //       } else {
  //         this.departmentList = this.copyDepartmentList;
  //       }
  //     } else {
  //       this.departmentList = this.copyDepartmentList;
  //     }
  //   }
  // }
  // displayFnDepartment(deptCode: Department): string {
  //   const dept = this.departmentList?.find((s: any) => s.deptCode === deptCode);
  //   return dept ? dept.name : '';
  // }

  // displayFinancialYearFn(finYearId: number): string {
  //   // Find the financial year by ID
  //   const finYear = this.finYrList.find(
  //     (f: any) => f.codeValueId === finYearId
  //   );
  //   return finYear ? finYear.codeValueDesc : '';
  // }
  // displayMonthFn(monthId: number) {
  //   const month = this.monthList.find((m: any) => m.monthId == monthId);
  //   return month ? month.monthName : '';
  // }

  dataSource: MatTableDataSource<DBTData> = new MatTableDataSource<DBTData>([]);
  totalRecords = 0;
  // pageSize = 10;

  deptcode = 101; // example
  schemecode = 501; // example
  finyr = 2025;
  month = 8;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // dbtDataForm = new FormGroup({
  //   deptCode: new FormControl(),
  //   monthId: new FormControl(),
  // });

  loadingFlag: boolean = false;
  displayedColumns: string[] = [
    'SerialNo',
    'Deptname',
    'SchemeName',
    'no_of_state_central',
    'no_of_state',
    'TotalBen',
    'TotalBenDigitized',
    'BenAadharSeeded',
    'MobileCaptured',
    'central_share',
    'state_share',
    'add_state_contribution',
    'state_contribution_for_additional',
    'FundTrnsferCash',
    'aa',
    'ab',
    'ac',
    'ad',
    'ae',
    'notrnscashelectronic',
    'amnttrnscashelectronic',
    'notrnscashother',
    'amnttrnscashother',
    'unitkind',
    'qtytransferedkind',
    'aadhartranskind',
    'cd',
    'nodeduplicated',
    'noghost',
    'othersavings',
    'savingamnt',
  ];
  // dataSource: any;
  schemeCode: any;
  currentPage: number = 0;
  pageSize: number = 5;
  totalSize: number = 0;
  pageNumber = 1;
  departmentList: any[] = [];
  copyDepartmentList: Department[] = [];
  monthList: Month[] = [];
  isSchemeFound: boolean = false;
  tableflag: boolean = false;
  public array: any;
  deptCode: any;
  selectedCatlog: any;
  name: any;
  monthName: any;
  showMyContainer: boolean = false;
  math = Math;
  deptname: any;
  monthname: any;
  deptindex: any;
  monthindex: any;
  reportData: any[] = [];
  schemeList: Scheme[] = [];
  copySchemeList: Scheme[] = [];
  finYrList: CodeValues[] = [];
  DeptCode: number = 0;
  SchemeCode: number = 0;
  MonthId: number = 0;
  FinYrCode: number = 0;
  dbtDataForm!: FormGroup;

  // @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild('TABLE') table: ElementRef | undefined;

  constructor(
    private dbtDataService: DbtdataService,
    private schemeService: SchemeService,
    private monthService: MonthService,
    private masterService: MasterService,
    private departmentService: DepartmentService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.dbtDataForm = this.fb.group({
      deptCode: [0],
      monthId: [0],
      schemeCode: [0],
      finYrCode: [0],
    });

    this.departmentService.getDepartments().subscribe((x) => {
      //this.departmentList = x;
      this.departmentList.push({ name: 'All', deptCode: 0 });
      x.forEach((elm) => {
        this.departmentList.push(elm);
      });
      // If you want to COPY this list elsewhere
      this.copyDepartmentList = [...this.departmentList];
      // console.log(x);
    });

    this.masterService
      .getCodeValues(MasterCodeType.Financial_Year)
      .subscribe((x) => {
        this.finYrList.push({
          Id: 0,
          codeTypeId: 0,
          codeValueDesc: 'ALL',
          codeValueId: '0',
        });
        x.forEach((elm) => {
          this.finYrList.push(elm);
        });
      });

    this.monthService.getMonths().subscribe((x) => {
      this.monthList.push({
        isActive: true,
        lastDay: 0,
        monthCode: '',
        monthId: 0,
        monthName: 'ALL',
        orderSeq: 1,
      });
      x.forEach((elm) => {
        this.monthList.push(elm);
      });
    });

    // const payload = {
    //   "pageNumber": 1,
    //   "pageSize": 5
    // }

    // this.dbtDataService.GetReportPushDataPaged(0, 0, 0, 0, payload).subscribe(x => {
    //   this.reportData = x.result.data;
    //   this.dataSource = new MatTableDataSource<ReportOfPushDataComponent>(x.result.data);
    //   this.dataSource.paginator = this.paginator;
    //   this.array = x.data;
    //   this.totalSize = this.array.length;
    // });
    this.loadTableData();
  }

  // ngAfterViewInit(): void {
  //   this.paginator.page.subscribe(() => {
  //     this.loadTableData();
  //   });
  // }

  // loadTableData(pageIndex: number, pageSize: number): void {
  //   const payload = {
  //     pageNumber: pageIndex + 1, // API pages often start at 1
  //     pageSize: pageSize
  //   };

  //   this.dbtDataService.GetReportPushDataPaged(0, 0, 0, 0, payload).subscribe(x => {
  //     this.reportData = x.result.data;
  //     this.dataSource = new MatTableDataSource<ReportOfPushDataComponent>(x.result.data);
  //     this.dataSource.paginator = this.paginator;
  //     this.array = x.data;
  //     this.totalSize = x.result.totalCount;
  //   });
  // }

  loadTableData() {
    const payload = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
    };

    // console.log(payload);

    this.dbtDataService
      .GetReportPushDataPaged(
        // this.DeptCode,
        this.dbtDataForm.value.deptCode || 0,
        this.dbtDataForm.value.schemeCode || 0,
        this.dbtDataForm.value.finYrCode || 0,
        this.dbtDataForm.value.monthCode || 0,
        payload
      )
      .subscribe((x) => {
        this.dataSource = new MatTableDataSource<DBTData>(x.result.data);
        // Always set custom sorting accessor (override MatTableDataSource default)
        this.dataSource.sortingDataAccessor = (item: any, property: string) => {
          const toNumber = (val: any): number => {
            const n = Number(val);
            return isNaN(n) ? 0 : n;
          };
          const toStringLower = (val: any): string =>
            (val ?? '').toString().toLowerCase();

          switch (property) {
            case 'SerialNo':
              return toNumber(item?.id);
            case 'Deptname':
              return toStringLower(item?.deptName);
            case 'SchemeName':
              return toStringLower(item?.schemeName);
            case 'no_of_state_central':
              return toNumber(item?.totalBen);
            case 'no_of_state':
              return 0;
            case 'TotalBen':
              return toNumber(item?.totalBen);
            case 'TotalBenDigitized':
              return toNumber(item?.totalBenDigitized);
            case 'BenAadharSeeded':
              return toNumber(item?.benAadharSeeded);
            case 'MobileCaptured':
              return toNumber(item?.mobileCaptured);
            case 'central_share':
              return toNumber(item?.fundCashCentre ?? item?.centralShare);
            case 'state_share':
              return toNumber(item?.fundCashState ?? item?.stateShare);
            case 'add_state_contribution':
              return toNumber(
                item?.fundCashStateAdditional ?? item?.additionalStateShare
              );
            case 'state_contribution_for_additional':
              return toNumber(item?.fundCashStateY);
            case 'FundTrnsferCash':
              return toNumber(item?.fundTrnsferCash);
            case 'aa':
              return toNumber(item?.expenditureKindCentre);
            case 'ab':
              return toNumber(item?.expenditureKindState);
            case 'ac':
              return toNumber(item?.expenditureKindStateY);
            case 'ad':
              return toNumber(item?.expenditureKindStateY);
            case 'ae':
              return toNumber(item?.expenditureKind);
            case 'notrnscashelectronic':
              return toNumber(item?.noTrnsCashElectronic);
            case 'amnttrnscashelectronic':
              return toNumber(item?.amntTrnsCashElectronic);
            case 'notrnscashother':
              return toNumber(item?.noTrnsCashOther);
            case 'amnttrnscashother':
              return toNumber(item?.amntTrnsCashOther);
            case 'unitkind':
              return toStringLower(item?.unitKind);
            case 'qtytransferedkind':
              return toNumber(item?.qtyTransferedKind);
            case 'aadhartranskind':
              return toNumber(item?.aadhartranskind ?? item?.aadharTransKind);
            case 'cd':
              return 0;
            case 'nodeduplicated':
              return toNumber(item?.noDeDuplicated);
            case 'noghost':
              return toNumber(item?.noGhost);
            case 'othersavings':
              return toNumber(item?.otherSavings);
            case 'savingamnt':
              return toNumber(item?.savingAmnt);
            default:
              return item[property as keyof typeof item];
          }
        };
        // this.dataSource.data = x.result.data;
        this.totalSize = x.result.totalCount;
        this.currentPage = 0;
        setTimeout(() => {
          if (this.sort) {
            this.dataSource.sort = this.sort;
          }
        });
      });
  }

  onSchemeSelect(e: any, schemeId: any) {
    this.dbtDataForm.value.schemeCode = schemeId;
    //console.log(roleId);
    if (e.isUserInput) {
      this.SchemeCode = schemeId; // this.dbtDataForm.value.schemeCode;
      // const payload = {
      //   "pageNumber": 1,
      //   "pageSize": 10
      // };

      this.loadTableData();

      // this.dbtDataService.GetReportPushDataPaged(this.dbtDataForm.value.deptCode ? this.dbtDataForm.value.deptCode : 0, schemeId,
      //   this.dbtDataForm.value.finYrCode ? this.dbtDataForm.value.finYrCode : 0,
      //   this.dbtDataForm.value.monthCode ? this.dbtDataForm.value.monthCode : 0, payload).subscribe(x => {
      //     //console.log(x.result);

      //     this.dataSource = new MatTableDataSource<DBTData>(x.result.data);
      //     //console.log(this.dataSource);
      //     this.dataSource.paginator = this.paginator;
      //     this.array = x;
      //     this.totalSize = this.array.length;
      //   });
    }
  }

  onFinancialYearSelect(e: any, finyrcode: any) {
    this.dbtDataForm.value.finYrCode = finyrcode;
    if (e.isUserInput) {
      this.FinYrCode = finyrcode; // this.dbtDataForm.value.finYrCode;
      // const payload = {
      //   "pageNumber": 1,
      //   "pageSize": 20
      // };

      this.loadTableData();
      // this.dbtDataService.GetReportPushDataPaged
      //   (this.dbtDataForm.value.deptCode ? this.dbtDataForm.value.deptCode : 0, this.dbtDataForm.value.schemeCode ? this.dbtDataForm.value.schemeCode : 0,
      //     finyrcode,
      //     this.dbtDataForm.value.monthCode ? this.dbtDataForm.value.monthCode : 0, payload).subscribe(x => {
      //       //console.log(x.result);

      //       this.dataSource = new MatTableDataSource<DBTData>(x.result.data);
      //       //console.log(this.dataSource);
      //       this.dataSource.paginator = this.paginator;
      //       this.array = x;
      //       this.totalSize = this.array.length;
      //     });
    }
  }

  onMonthSelect(e: any, monthcode: any) {
    this.dbtDataForm.value.monthCode = monthcode;
    if (e.isUserInput) {
      this.MonthId = monthcode; // this.dbtDataForm.value.monthCode;
      // const payload = {
      //   "pageNumber": 1,
      //   "pageSize": 20
      // }

      this.loadTableData();

      // this.dbtDataService.GetReportPushDataPaged
      //   (this.dbtDataForm.value.deptCode ? this.dbtDataForm.value.deptCode : 0, this.dbtDataForm.value.schemeCode ? this.dbtDataForm.value.schemeCode : 0,
      //     this.dbtDataForm.value.finYrCode ? this.dbtDataForm.value.finYrCode : 0,
      //     monthcode, payload).subscribe(x => {
      //       //console.log(x.result);
      //       this.dataSource = new MatTableDataSource<DBTData>(x.result.data);
      //       //console.log(this.dataSource);
      //       this.dataSource.paginator = this.paginator;
      //       this.array = x;
      //       this.totalSize = this.array.length;
      //     });
    }
  }

  onDepartmentSelect(e: any, deptcode: any) {
    this.dbtDataForm.value.deptCode = deptcode;
    //console.log(e);
    if (e.isUserInput) {
      this.dbtDataForm.get('schemeCode')?.reset();
      this.schemeList = [];
      this.DeptCode = deptcode;
      this.schemeService.findActiveSchemes(deptcode).subscribe((x) => {
        //console.log(x);
        if (x.length > 0) {
          this.schemeList.push({
            id: 0,
            deptCode: 0,
            deptName: '',
            schemeType: 0,
            schemeName: 'ALL',
            schemeCode: '',
            dbtSchemeCode: '',
            transferType: '',
            fundingPattern: '',
            centralShare: 0,
            stateShare: 0,
            additionalStateShare: 0,
            dbtSchemeCode_B: '',
            dbtSchemeCode_C: '',
            dbtSchemeCode_E: '',
            onBoarded: false,
            progress: 0,
            mISIntegrated: false,
            isActive: false,
          });
          x.forEach((elm) => {
            this.schemeList.push(elm);
          });
        }
        // this.schemeList = this.copySchemeList = x;
        //this.iterator();
        this.loadTableData();
      });

      // const payload = {
      //   "pageNumber": 1,
      //   "pageSize": 20
      // }

      // this.dbtDataService.GetReportPushDataPaged
      //   (deptcode, this.dbtDataForm.value.schemeCode ? this.dbtDataForm.value.schemeCode : 0,
      //     this.dbtDataForm.value.finYrCode ? this.dbtDataForm.value.finYrCode : 0,
      //     this.dbtDataForm.value.monthCode ? this.dbtDataForm.value.monthCode : 0, payload).subscribe(x => {
      //       //console.log(x.result);
      //       this.dataSource = new MatTableDataSource<DBTData>(x.result.data);
      //       //console.log(this.dataSource);
      //       this.dataSource.paginator = this.paginator;
      //       this.array = x.result.data;
      //       this.totalSize = this.array.length;
      //     });
      // this.loadTableData();
    }
  }

  public saveToExcel() {
    const payload = {
      pageNumber: this.pageNumber, // 1, // Adjust as needed
      pageSize: this.pageSize, // 20 // Adjust as needed
    };
    this.dbtDataService
      .GetReportPushDataPaged(
        this.DeptCode,
        this.SchemeCode,
        this.FinYrCode,
        this.MonthId,
        payload
      )
      .subscribe((x) => {
        // console.log(x);

        let dataToExport = x.result.data;
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(
          wb,
          'Report_of_Pushed_data' + Date().valueOf() + '.xlsx'
        );
      });
    // const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource);
    // const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table?.nativeElement);
    // const wb: XLSX.WorkBook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    // XLSX.writeFile(wb, 'Report_of_Pushed_data' + Date().valueOf() + '.xlsx');
  }

  saveFilterExcel() {
    const deptcode = this.dbtDataForm.value.deptCode || 0;
    const schemecode = this.dbtDataForm.value.schemeCode || 0;
    const finyr = this.dbtDataForm.value.finYrCode || 0;
    const month = this.dbtDataForm.value.monthId || 0;
    // console.log(deptcode,schemecode,finyr, month);
    this.dbtDataService
      .GetReportPushData(deptcode, schemecode, finyr, month)
      .subscribe((x) => {
        let dataToExport = x.result;
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(
          wb,
          'Report_of_Pushed_data' + Date().valueOf() + '.xlsx'
        );
      });
  }

  public exportAllToExcel() {
    this.dbtDataService.GetReportPushData(0, 0, 0, 0).subscribe((x) => {
      // console.log(x);

      let dataToExport = x.result;
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, 'Report_of_Pushed_data' + Date().valueOf() + '.xlsx');
    });
  }
  onSubmit() {}

  // public handlePage(e: any) {
  //   this.currentPage = e.pageIndex;
  //   this.pageSize = e.pageSize;
  //   this.iterator();
  // }

  onPageChange(event: PageEvent) {
    // console.log('Page changed:', event);

    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadTableData();
  }

  private iterator() {
    const end = (this.currentPage + 1) * this.pageSize;
    const start = this.currentPage * this.pageSize;
    const part = this.array.slice(start, end);
    this.dataSource = part;
  }

  searchScheme(e: any) {
    if (e !== undefined) {
      let term = '';
      if (e.target.value.length > 0) {
        term = e.target.value;
      }
      if (term !== undefined && term !== '' && term != null) {
        if (term.length > 0) {
          this.schemeList = this.copySchemeList.filter((x: any) =>
            x.schemeName.toLowerCase().includes(term.toLowerCase())
          );
        } else {
          this.schemeList = this.copySchemeList;
        }
      } else {
        this.schemeList = this.copySchemeList;
      }
    }
  }

  displaySchemeFn(scheme: Scheme): string {
    const sc = this.schemeList?.find((s: any) => s.id === scheme);
    return sc ? sc.schemeName : '';
  }
  searchDept(e: any) {
    if (e !== undefined) {
      let term = '';
      if (e.target.value.length > 0) {
        term = e.target.value;
      }
      if (term !== undefined && term !== '' && term != null) {
        if (term.length > 0) {
          this.departmentList = this.copyDepartmentList.filter((x: any) =>
            x.name.toLowerCase().includes(term.toLowerCase())
          );
        } else {
          this.departmentList = this.copyDepartmentList;
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

  displayFinancialYearFn(finYearId: number): string {
    // Find the financial year by ID
    const finYear = this.finYrList.find(
      (f: any) => f.codeValueId === finYearId
    );
    return finYear ? finYear.codeValueDesc : '';
  }
  displayMonthFn(monthId: number) {
    const month = this.monthList.find((m: any) => m.monthId == monthId);
    return month ? month.monthName : '';
  }
}
