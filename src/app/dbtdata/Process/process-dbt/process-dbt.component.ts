import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ViewChild } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CodeValues } from '../../../model/code-values.model';
import { Scheme } from '../../../model/scheme.model';
import { DBTData } from '../../../model/dbtdata.model';
import { Month } from '../../../model/month.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DbtdataService } from '../../../service/dbtdata.service';
import { MasterService } from '../../../service/master.service';
import { HelperService } from '../../../service/helper.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DepartmentService } from '../../../service/department.service';
import { MonthService } from '../../../service/month.service';
import { UserService } from '../../../service/user.service';
import { SchemeService } from '../../../service/scheme.service';
import { ToastrService } from 'ngx-toastr';
import { MasterCodeType } from '../../../../app_enum';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmProcessDbtComponent } from '../Confirm/confirm-process-dbt/confirm-process-dbt.component';
import { ViewCommentsComponent } from '../../../view-comments/view-comments.component';
import { EditDbtComponent } from '../../../edit-dbt/edit-dbt.component';

@Component({
  selector: 'app-process-dbt',
  imports: [SharedModule],
  templateUrl: './process-dbt.component.html',
  styleUrl: './process-dbt.component.scss',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', color: 'red' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ProcessDbtComponent {

  dbtDataForm!: FormGroup;
  public array: any;
  displayedColumns: string[] = ['serialNo', 'deptName', 'schemeName', 'schemeType', 'financialYear', 'reportingMonthName', 'totalBen', 'fundTrnsferCash', 'comment', 'action', 'bulkApprove'];
  //action
  dataSource: any;

  currentPage: number = 0;
  pageSize: number = 5;
  totalSize: number = 0;
  decisionTypeList: CodeValues[] = [];
  isTableExpanded = false;
  checked: any;
  clickedRows = new Set<any>();
  isRowClicked: boolean = false;
  clickedRowsArray: any[] = [];
  // departmentList: Department[] = [];
  departmentList: any[] = [];
  schemeList: Scheme[] = [];
  selectDept: number = 0;
  admin: any;
  searchForm !: FormGroup;
  filterData: DBTData[] = [];
  roleid: any;
  financialYear: any;
  finYrList: CodeValues[] = [];
  reportingMonthList: Month[] = [];
  schemeCodeList: any;
  multiSchmeList: any[] = [];


  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dbtDataService: DbtdataService,
    private masterService: MasterService,
    public helperService: HelperService,
    public dialog: MatDialog
    , private departmentService: DepartmentService,
    private monthService: MonthService,
    private userService: UserService,

    private schemeService: SchemeService,
    private toastr: ToastrService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.roleid = localStorage.getItem('role');
    this.schemeCodeList = JSON.parse(localStorage.getItem('schemeCodeList') || '{}');
    this.masterService.getCodeValues(MasterCodeType.DecisionType).subscribe(x => {
      this.decisionTypeList = x;
    });
    this.departmentService.getDepartments().subscribe(x => {
      this.departmentList.push({ name: 'All', deptCode: '' });
      x.forEach(elm => {
        this.departmentList.push(elm);
      });
    });


    this.masterService.getCodeValues(MasterCodeType.Financial_Year).subscribe(x => {

      this.finYrList.push({
        Id: 0,
        codeTypeId: 0,
        codeValueDesc: "ALL",
        codeValueId: "",
      });
      x.forEach(elm => {
        this.finYrList.push(elm);
      });


      //this.finYrList = x;
      //console.log(this.finYrList);
    });

    this.monthService.getMonths().subscribe(x => {


      this.reportingMonthList.push({
        isActive: true,
        lastDay: 0,
        monthCode: "",
        monthId: 0,
        monthName: "ALL",
        orderSeq: 1
      });
      x.forEach(elm => {
        this.reportingMonthList.push(elm);
      });


      // this.reportingMonthList = x;
      // console.log(x);

    });

    this.dbtDataForm = this.fb.group({
      deptCode: [],
      schemeCode: [],
      finYrCode: [],
      monthCode: [],
    });
    this.searchForm = this.fb.group({
      searchString: ['']
    });
    this.checked = false;
    this.loadDataTable();
  }

  getSerialNumber(index: number): number {
    //console.log(index); // Check if index is logged correctly
    return index + 1;
  }


  getRowStyle(row: any) {
    // console.log(row.submition_flag);

    if (row.submition_flag == 0) {
      return { backgroundColor: '' }; // Apply yellow background for condition 'value1'
    } else {
      return { background: 'linear-gradient(0deg, rgb(255 255 255) 0%, rgb(168 197 223) 100%)' }; // Return empty object if no condition matches
    }
  }
  public handlePage(e: any) {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    //this.iterator();
  }

  //===================================== OLD VERSION ========================================
  // loadDataTable() {
  //   let deptCode = localStorage.getItem('deptCode');
  //   let schemeCode=localStorage.getItem('schemeCode');
  //   if (deptCode == null || deptCode == "") {
  //     //deptCode = -1;
  //     //this.departmentCode = -1;
  //     this.admin = true;
  //   }
  //   this.dbtDataService.GetProcessApplicationList(deptCode).subscribe(x => {
  //     //console.log(x);
  //     this.dataSource = new MatTableDataSource(x);
  //     //console.log(this.dataSource);
  //     this.dataSource.paginator = this.paginator;
  //     this.array = x;
  //     this.totalSize = this.array.length;
  //     // this.iterator();
  //   });
  // }
  //========================================== NEW VWESION ======================================
  loadDataTable() {
    this.array = [];
    this.multiSchmeList = [];
    this.dataSource = new MatTableDataSource([]);
    let deptId = Number(localStorage.getItem('deptCode'));
    let schemeCode = localStorage.getItem('schemeCode');
    if (deptId === null || deptId === undefined || deptId <= 0) {
      deptId = -1;
      //this.departmentCode = -1;
      this.admin = true;
    }
    if (schemeCode == null || schemeCode == "") {
      schemeCode = "unset";
    }
    console.log(Object.keys(this.schemeCodeList).length > 0);

    if (Object.keys(this.schemeCodeList).length > 0) {
      for (let i in this.schemeCodeList) {
        this.dbtDataService.GetProcessApplicationListByScheme(deptId, this.schemeCodeList[i]).subscribe(x => {
          this.multiSchmeList.push(...x);
          this.configureDataSource(this.multiSchmeList);
          this.array = this.multiSchmeList;
          this.totalSize = this.array.length;
        });
      }
    }
    else {
      this.dbtDataService.GetProcessApplicationListByScheme(deptId, schemeCode).subscribe(x => {
        // console.log(x);
        this.configureDataSource(x);
        this.array = x;
        this.totalSize = this.array.length;
      });
    }
  }

  //Implement Login for Pagination
  private iterator() {
    const end = (this.currentPage + 1) * this.pageSize;
    const start = this.currentPage * this.pageSize;
    const part = this.array.slice(start, end);
    this.dataSource = part;
  }

  //Implement Logic for Filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private configureDataSource(rows: any[]): void {
    this.dataSource = new MatTableDataSource(rows);
    const monthToIndex = (m: any): number => {
      const s = (m ?? '').toString().trim().toLowerCase();
      const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
      const idx = months.findIndex(abbr => s.startsWith(abbr));
      return idx === -1 ? 13 : idx + 1;
    };
    const finYearKey = (fy: any): number => {
      if (fy === null || fy === undefined) return 0;
      if (typeof fy === 'number') return fy;
      const s = fy.toString().trim();
      const m = s.match(/(19|20)\d{2}/);
      if (m) return parseInt(m[0], 10);
      const n = Number(s);
      return isNaN(n) ? 0 : n;
    };
    this.dataSource.sortingDataAccessor = (item: any, property: string) => {
      switch (property) {
        case 'reportingMonthName':
          return monthToIndex(item?.reportingMonthName ?? item?.monthname ?? item?.reportingMonth);
        case 'financialYear':
          return finYearKey(item?.financialYear ?? item?.fin_year ?? item?.financial_year);
        default:
          const value = (item as any)[property];
          return typeof value === 'string' ? value.toLowerCase() : value;
      }
    };
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  toggleTableRows() {
    this.isTableExpanded = !this.isTableExpanded;

    this.dataSource.data.forEach((row: any) => {
      row.isExpanded = this.isTableExpanded;
    })
  }

  openConfirmDialog(element: any[]) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'form-dialog';
    dialogConfig.width = '60%';
    dialogConfig.minWidth = '400px';
    dialogConfig.data = element;

    //dialogConfig.height = '100%';

    const dialogRef = this.dialog.open(ConfirmProcessDbtComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(response => {
      if (response != true) {
        this.toastr.success(response);
        this.loadDataTable();
      }
    });
  }

  openCommentsDialog(dbtid: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'form-dialog';
    dialogConfig.width = '60%';
    dialogConfig.minWidth = '400px';
    //dialogConfig.data = element;
    dialogConfig.data = {
      eventData: dbtid,
    };
    const dialogRef = this.dialog.open(ViewCommentsComponent, dialogConfig);
  }
  getCheckedItems() {
    //this.checked = this.items.filter(i => i.checked == true);
    this.checked = true;
  }

  masterToggle() {
    //debugger;
    this.isAllSelected() ? this.clickedRows.clear() : this.dataSource.filteredData?.forEach((row: any) => this.clickedRows.add(row));
    if (this.clickedRows.size) this.isRowClicked = true;
    else this.isRowClicked = false;
  }

  isAllSelected() {
    //debugger;
    const numSelected = this.clickedRows.size;
    const numRows = this.dataSource.filteredData?.length;
    return numSelected === numRows;
  }

  tickRow(event: any, row: any) {
    const rowSelected = this.clickedRows.size;
    this.clickedRows.has(row) ? this.clickedRows.delete(row) : this.clickedRows.add(row);
    if (this.clickedRows.size) this.isRowClicked = true;
    else this.isRowClicked = false;
  }


  goForApprove() {
    this.clickedRowsArray = Array.from(this.clickedRows);
    //console.log(this.clickedRowsArray);

    if (this.clickedRowsArray.length > 0) {
      this.openConfirmDialog(this.clickedRowsArray);
    } else {
      //this.notify.alert('Please select atleast one row..!');
      this.toastr.error('Please select atleast one row..!');
    }
  }

  clearSelection() {
    this.clickedRows.clear();
  }

  onDepartmentSelect(e: any, deptcode: any) {
    this.clearSelection();
    //console.log(e);
    if (e.isUserInput) {
      this.schemeService.findSchemes(deptcode).subscribe(x => {
        //console.log(x);
        this.schemeList = x;
        //this.iterator();
      });
      this.selectDept = deptcode;
      //this.loaddata(deptcode);
      // this.dbtDataService.GetProcessApplicationList(deptcode).subscribe(x => {
      //   //console.log(x);
      //   this.dataSource = new MatTableDataSource<DBTData>(x);
      //   //console.log(this.dataSource);
      //   this.dataSource.paginator = this.paginator;
      //   this.array = x;
      //   this.totalSize = this.array.length;
      //   // this.iterator();
      // });

      this.dbtDataService.GetProcessApplicationListByDeptSchemeFinyrMonth
        (deptcode, this.dbtDataForm.value.schemeCode ? this.dbtDataForm.value.schemeCode : 0,
          this.dbtDataForm.value.finYrCode ? this.dbtDataForm.value.finYrCode : 0,
          this.dbtDataForm.value.monthCode ? this.dbtDataForm.value.monthCode : 0).subscribe(x => {
            //console.log(x.result);

            this.configureDataSource(x.result);
            this.array = x;
            this.totalSize = this.array.length;
          });
    }

  }

  onSchemeSelect(e: any, schemeId: any) {
    this.clearSelection();
    //console.log(schemeId);
    if (e.isUserInput) {
      // this.dbtDataService.GetProcessApplicationListByScheme(schemeId).subscribe(x => {
      //   this.filterData = x;
      //   //console.log(this.filterData);
      //   this.dataSource = new MatTableDataSource(x);
      //   this.dataSource.paginator = this.paginator;
      //   // this.dataSource.sort = this.sort;
      //   this.array = x;
      //   this.totalSize = this.array.length;
      // });

      this.dbtDataService.GetProcessApplicationListByDeptSchemeFinyrMonth(this.dbtDataForm.value.deptCode ? this.dbtDataForm.value.deptCode : 0, schemeId,
        this.dbtDataForm.value.finYrCode ? this.dbtDataForm.value.finYrCode : 0,
        this.dbtDataForm.value.monthCode ? this.dbtDataForm.value.monthCode : 0).subscribe(x => {
          //console.log(x.result);

          this.configureDataSource(x.result);
          this.array = x;
          this.totalSize = this.array.length;
        });
    }

  }

  onFinancialYearSelect(e: any, finyrcode: any) {

    // if (e.isUserInput) {
    //   this.dbtDataService.AllDBTDataByDept(deptcode).subscribe(x => {
    //     console.log(x.result);
    //     this.dataSource = new MatTableDataSource<DBTData>(x.result);
    //     //console.log(this.dataSource);
    //     this.dataSource.paginator = this.paginator;
    //     this.array = x;
    //     this.totalSize = this.array.length;
    //     //this.iterator();
    //   });
    // }

    if (e.isUserInput) {
      //console.log(parseInt(finyrcode));
      this.dbtDataService.GetProcessApplicationListByDeptSchemeFinyrMonth
        (this.dbtDataForm.value.deptCode ? this.dbtDataForm.value.deptCode : 0, this.dbtDataForm.value.schemeCode ? this.dbtDataForm.value.schemeCode : 0,
          finyrcode,
          this.dbtDataForm.value.monthCode ? this.dbtDataForm.value.monthCode : 0).subscribe(x => {
            //console.log(x.result);

            this.configureDataSource(x.result);
            this.array = x;
            this.totalSize = this.array.length;
          });
    }


  }

  onMonthSelect(e: any, monthcode: any) {

    if (e.isUserInput) {
      this.dbtDataService.GetProcessApplicationListByDeptSchemeFinyrMonth
        (this.dbtDataForm.value.deptCode ? this.dbtDataForm.value.deptCode : 0, this.dbtDataForm.value.schemeCode ? this.dbtDataForm.value.schemeCode : 0,
          this.dbtDataForm.value.finYrCode ? this.dbtDataForm.value.finYrCode : 0,
          monthcode).subscribe(x => {
            //console.log(x.result);

            this.configureDataSource(x.result);
            this.array = x;
            this.totalSize = this.array.length;
          });
    }

  }

  onEditClickDraft(event: any, reportingMonth: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'form-dialog';
    dialogConfig.width = '60%';
    dialogConfig.minWidth = '400px';
    dialogConfig.height = '100%';

    dialogConfig.data = {
      eventData: event,
      month: reportingMonth
    };
    const dialogRef = this.dialog.open(EditDbtComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(response => {
      if (response != true) {
        this.toastr.success(response);
        this.loadDataTable();
      }
    });
  }
}
