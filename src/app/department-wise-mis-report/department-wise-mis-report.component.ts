import { Component, ElementRef, ViewChild } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { misMonthWiseReportDtls } from '../model/scheme.model';
import { Department } from '../model/department.model';
import { Month } from '../model/month.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { DbtdataService } from '../service/dbtdata.service';
import { DepartmentService } from '../service/department.service';
import { MonthService } from '../service/month.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-department-wise-mis-report',
  imports: [SharedModule],
  templateUrl: './department-wise-mis-report.component.html',
  styleUrl: './department-wise-mis-report.component.scss'
})
export class DepartmentWiseMisReportComponent {


  dbtDataForm = new FormGroup({
    deptCode: new FormControl(),
    monthId: new FormControl(),
  })



  loadingFlag: boolean = false;
  displayedColumns: string[] = ['SerialNo', 'SchemeName', 'FinancialYear', 'Month', 'no_of_state_central', 'no_of_state', 'TotalBen', 'TotalBenDigitized', 'BenAadharSeeded', 'MobileCaptured', 'central_share', 'state_share', 'add_state_contribution', 'state_contribution_for_additional', 'FundTrnsferCash', 'aa', 'ab', 'ac', 'ad', 'ae', 'notrnscashelectronic', 'amnttrnscashelectronic', 'notrnscashother', 'amnttrnscashother', 'unitkind', 'qtytransferedkind', 'aadhartranskind', 'cd', 'nodeduplicated', 'noghost', 'othersavings', 'savingamnt'];
  dataSource: MatTableDataSource<misMonthWiseReportDtls> = new MatTableDataSource<misMonthWiseReportDtls>([]);
  schemeCode: any;
  currentPage: number = 0;
  pageSize: number = 5;
  totalSize: number = 0;
  departmentList: Department[] = [];
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
  DeptCode: number = 0;
  MonthId: number = 0;
  serialNo: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('TABLE') table: ElementRef | undefined;
  dialogRef: any;
  constructor(private toastr: ToastrService, private dbtDataService: DbtdataService, private departmentService: DepartmentService, private monthService: MonthService) { }

  ngOnInit(): void {

    this.departmentService.getDepartments().subscribe(x => {
      // Create a complete Department object for 'ALL'
      const allDept: Department = {
        deptCode: 0,
        name: 'ALL',
        name_Code: '',
        name_Symbol: '',
        mobile: '',
        email: '',
        createdBy: '',
        status: 0,
        isactive: true,
        createdOn: '',
        modifiedOn: '',
        modifiedBy: ''
      };
      this.copyDepartmentList = this.departmentList = [allDept, ...x];
    });
    this.monthService.getMonths().subscribe(x => {
      this.monthList = [{
        monthId: 0,
        monthName: 'ALL',
        monthCode: '',
        lastDay: 0,
        orderSeq: 0,
        isActive: true,
      }, ...x];
    });

  }

  onSubmit() {

    this.deptindex = this.departmentList.findIndex(x => x.deptCode === this.dbtDataForm.value['deptCode']);
    this.deptname = this.departmentList[this.deptindex].name;
    this.monthindex = this.monthList.findIndex(x => x.monthId === this.dbtDataForm.value['monthId']);
    this.monthname = this.monthList[this.monthindex].monthName;
    // console.log(this.dbtDataForm.value['deptCode']);
    // console.log(this.dbtDataForm.value['monthId']);
    if (this.dbtDataForm.value['deptCode'] != null && this.dbtDataForm.value['monthId'] != null) {
      this.loadingFlag = true;
      this.DeptCode = this.dbtDataForm.value['deptCode'];
      this.MonthId = this.dbtDataForm.value['monthId'];
      this.dbtDataService.GetDepartmentWiseMisReport(this.dbtDataForm.value['deptCode'], this.dbtDataForm.value['monthId'], 0, 0).subscribe(x => {

        if (x.result.data.length > 0) {
          this.loadingFlag = false;
          this.dataSource = new MatTableDataSource<misMonthWiseReportDtls>(x.result.data);
          this.dataSource.sortingDataAccessor = (item: any, property: string) => {
            const toNumber = (val: any): number => {
              const n = Number(val);
              return isNaN(n) ? 0 : n;
            };
            const monthToIndex = (m: any): number => {
              const s = (m ?? '').toString().trim().toLowerCase();
              const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
              const idx = months.findIndex(abbr => s.startsWith(abbr));
              return idx === -1 ? 13 : idx + 1; // place unknowns at bottom
            };

            switch (property) {
              case 'SchemeName': return (item.schemename ?? '').toString().toLowerCase();
              case 'FinancialYear': return toNumber(item.fin_year);
              case 'Month': return monthToIndex(item.month ?? item.monthname ?? item.reportingMonthName);
              case 'TotalBen': return toNumber(item.totalben ?? item.TotalBen);
              case 'TotalBenDigitized': return toNumber(item.totalbendigitized ?? item.TotalBenDigitized);
              case 'BenAadharSeeded': return toNumber(item.benaadharseeded ?? item.BenAadharSeeded);
              case 'MobileCaptured': return toNumber(item.mobilecaptured ?? item.MobileCaptured);
              case 'FundTrnsferCash': return toNumber(item.fundtrnsfercash ?? item.FundTrnsferCash);
              case 'aa': return toNumber(item.central_share);
              case 'ab': return toNumber(item.state_share);
              case 'ac': return toNumber(item.add_state_contribution);
              case 'ad': return toNumber(item.state_contribution_for_additional);
              case 'ae': return toNumber(item.fundtrnsfercash ?? item.FundTrnsferCash);
              default: return item[property];
            }
          };
          // this.dataSource.paginator = this.paginator;
          this.array = x.result.data;
          this.totalSize = this.array.length;
          this.currentPage = 0;
          //console.log(this.dataSource.filteredData);
          //console.log(this.departmentList)

          // this.iterator();
          this.tableflag = true;
          setTimeout(() => {
            debugger
            if (this.paginator) {
              this.dataSource.paginator = this.paginator;
              this.paginator.firstPage();
            }
            if (this.sort) {
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            }
          });
        }
        else {
          this.tableflag = false;
          this.toastr.error('Data Not Found')
          //alert('ffffffff');
        }

      });

    }


  }

  public handlePage(e: any) {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    // this.iterator();
  }
  private iterator() {
    const end = (this.currentPage + 1) * this.pageSize;
    const start = this.currentPage * this.pageSize;
    const part = this.array.slice(start, end);
    this.dataSource = part;
  }

  public saveToExcel() {

    this.dbtDataService.GetDepartmentWiseMisReport(this.dbtDataForm.value.deptCode, this.dbtDataForm.value.monthId, this.currentPage + 1, this.pageSize /*this.DeptCode, this.MonthId*/).subscribe(x => {

      let dataToExport = x.result.data;
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, 'all-department-wise-mis-report' + Date().valueOf() + '.xlsx');

    });

    // const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource);
    // const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table?.nativeElement);
    // const wb: XLSX.WorkBook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    // XLSX.writeFile(wb, 'department-wise-mis-report' + Date().valueOf() + '.xlsx');
  }

  public exportAllToExcel() {
    this.dbtDataService.GetAllDepartmentWiseMisReport().subscribe(x => {

      let dataToExport = x.data;
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, 'all-department-wise-mis-report' + Date().valueOf() + '.xlsx');

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
}
