import { Component, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SharedModule } from '../../shared/shared.module';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CodeValues } from '../../model/code-values.model';
import { Scheme } from '../../model/scheme.model';
import { DBTData } from '../../model/dbtdata.model';
import { Month } from '../../model/month.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DbtdataService } from '../../service/dbtdata.service';
import { MasterService } from '../../service/master.service';
import { HelperService } from '../../service/helper.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DepartmentService } from '../../service/department.service';
import { UserService } from '../../service/user.service';
import { MonthService } from '../../service/month.service';
import { SchemeService } from '../../service/scheme.service';
import { ToastrService } from 'ngx-toastr';
import { MasterCodeType } from '../../../app_enum';
import { MatTableDataSource } from '@angular/material/table';
import { DbtdataDetailComponent } from '../View/dbtdata-detail/dbtdata-detail.component';
import { ViewCommentsComponent } from '../../view-comments/view-comments.component';
import { ConfirmBharatDbtPushComponent } from '../../dbtdata/confirm-bharat-dbt-push/confirm-bharat-dbt-push.component';
import { Department } from '../../model/department.model';

@Component({
  selector: 'app-push-bharat-dbt',
  imports: [SharedModule],
  templateUrl: './push-bharat-dbt.component.html',
  styleUrl: './push-bharat-dbt.component.scss',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', color: 'red' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PushBharatDbtComponent {


  dbtDataForm!: FormGroup;

  public array: any;
  displayedColumns: string[] = ['serialNo', 'deptName', 'schemeName', 'schemeType', 'financialYear', 'reportingMonthName', 'totalBen', 'fundTrnsferCash', 'comment', 'action', 'bulkApprove'];
  //action
  dataSource: any;

  currentPage: number = 0;
  pageSize: number = 10;
  totalSize: number = 0;
  decisionTypeList: CodeValues[] = [];
  isTableExpanded = false;

  checked: any;
  clickedRows = new Set<any>();
  isRowClicked: boolean = false;
  clickedRowsArray: any[] = [];

  // departmentList: Department[] = [];
  departmentList: any[] = [];
  copyDepartmentList: any[] = [];
  schemeList: Scheme[] = [];
  CopyschemeList: Scheme[] = [];
  selectDept: number = 0;
  admin: any;
  //searchForm !: FormGroup;
  filterData: DBTData[] = [];
  finYrList: CodeValues[] = [];
  reportingMonthList: Month[] = [];


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dbtDataService: DbtdataService,
    private masterService: MasterService,
    public helperService: HelperService,
    public dialog: MatDialog,
    private departmentService: DepartmentService,
    private userService: UserService,
    private monthService: MonthService,
    private schemeService: SchemeService,
    private toastr: ToastrService, public fb: FormBuilder) { }

  ngOnInit(): void {
    this.masterService.getCodeValues(MasterCodeType.DecisionType).subscribe(x => {
      this.decisionTypeList = x;
    });
    let deptCode = localStorage.getItem('deptCode');
    if (deptCode == null || deptCode == "") {
      //deptCode = -1;
      //this.departmentCode = -1;
      this.admin = true;
    }
    this.departmentService.getDepartments().subscribe(x => {
      this.departmentList.push({ name: 'All', deptCode: 0 });
      x.forEach(elm => {
        this.departmentList.push(elm);
      });
      // If you want to COPY this list elsewhere
      this.copyDepartmentList = [...this.departmentList];
      // console.log(x);
      this.dbtDataForm = this.fb.group({
        deptCode: [''],
        schemeCode: [''],
        finYrCode: [''],
        monthCode: [''],
      });

      // this.searchForm = this.fb.group({
      //   searchString: [],
      // });
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
    this.loadDataTable();
    this.clearSelection();
  }

  getSerialNumber(index: number): number {
    return index + 1;
  }

  getRowStyle(row: any) {
    //console.log(row.submition_flag);

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

  loadDataTable() {
    let deptCode = localStorage.getItem('deptCode');
    this.dbtDataService.GetFinalApplicationList(deptCode).subscribe(x => {
      console.log(x);
      this.dataSource = new MatTableDataSource<DBTData>(x);
      //console.log(this.dataSource);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.array = x;
      this.totalSize = this.array.length;
      //this.iterator();
    });
  }
  viewDBTData(element: DBTData) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    // dialogConfig.panelClass = 'form-dialog';
    dialogConfig.width = '60%';
    dialogConfig.minWidth = '400px';
    // dialogConfig.height = '100%';
    dialogConfig.data = element;

    const dialogRef = this.dialog.open(DbtdataDetailComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(response => {
      // if(response != true){
      //   this.toastr.success(response);
      // }
    });
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
    const dialogRef = this.dialog.open(ConfirmBharatDbtPushComponent, dialogConfig);

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
    //dialogConfig.height = '100%';
    const dialogRef = this.dialog.open(ViewCommentsComponent, dialogConfig);
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

  // element = {
  //   isActive: true // or false depending on your initial state
  // };
  clearSelection() {
    this.clickedRows.clear();
  }

  onDepartmentSelect(e: any, deptcode: any) {
    // this.dbtDataForm.reset();
    // this.dbtDataForm.value.schemeCode.reset();
    this.clearSelection();
    //this.element.isActive = false;
    //console.log(e);
    if (e.isUserInput) {
      this.schemeService.findActiveSchemes(deptcode).subscribe(x => {
        //console.log(x);
        this.schemeList = this.CopyschemeList = x;
        //this.iterator();
      });
      this.selectDept = deptcode;
      //this.loaddata(deptcode);
      this.loadDataDependsOnDepartment(deptcode);
    }

  }
  loadDataDependsOnDepartment(deptcode: any) {
    // this.dbtDataService.GetFinalApplicationList(deptcode).subscribe(x => {
    //   //console.log(x);
    //   this.dataSource = new MatTableDataSource<DBTData>(x);
    //   //console.log(this.dataSource);
    //   this.dataSource.paginator = this.paginator;
    //   this.array = x;
    //   this.totalSize = this.array.length;
    //   // this.iterator();

    // });
    // console.log(deptcode);

    this.dbtDataService.GetDbtDataDeptSchemeFinyrMonthWise
      (deptcode, this.dbtDataForm.value.schemeCode ? this.dbtDataForm.value.schemeCode : 0,
        this.dbtDataForm.value.finYrCode ? this.dbtDataForm.value.finYrCode : 0,
        this.dbtDataForm.value.monthCode ? this.dbtDataForm.value.monthCode : 0, 0).subscribe(x => {
          //console.log(x.result);

          this.dataSource = new MatTableDataSource<DBTData>(x.result);
          //console.log(this.dataSource);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.array = x.result;
          this.totalSize = this.array.length;
        });
  }

  element = {
    isActive: true // or false depending on your initial state
  };

  clearCheckbox() {
    this.element.isActive = false;
  }

  onSchemeSelect(e: any, schemeId: any) {
    this.clearSelection();
    //console.log(this.dbtDataForm.value.deptCode);
    if (e.isUserInput) {
      // this.dbtDataService.GetFinalApplicationListByScheme(schemeId).subscribe(x => {
      //   this.filterData = x;
      //   //console.log(this.filterData);
      //   this.dataSource = new MatTableDataSource(x);
      //   this.dataSource.paginator = this.paginator;
      //   // this.dataSource.sort = this.sort;
      //   this.array = x;
      //   this.totalSize = this.array.length;
      //   //this.iterator();
      // });

      this.dbtDataService.GetDbtDataDeptSchemeFinyrMonthWise(this.dbtDataForm.value.deptCode ? this.dbtDataForm.value.deptCode : 0, schemeId,
        this.dbtDataForm.value.finYrCode ? this.dbtDataForm.value.finYrCode : 0,
        this.dbtDataForm.value.monthCode ? this.dbtDataForm.value.monthCode : 0, 0).subscribe(x => {
          //console.log(x.result);

          this.dataSource = new MatTableDataSource<DBTData>(x.result);
          //console.log(this.dataSource);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.array = x.result;
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
      this.dbtDataService.GetDbtDataDeptSchemeFinyrMonthWise
        (this.dbtDataForm.value.deptCode ? this.dbtDataForm.value.deptCode : 0, this.dbtDataForm.value.schemeCode ? this.dbtDataForm.value.schemeCode : 0,
          finyrcode,
          this.dbtDataForm.value.monthCode ? this.dbtDataForm.value.monthCode : 0, 0).subscribe(x => {
            //console.log(x.result);

            this.dataSource = new MatTableDataSource<DBTData>(x.result);
            //console.log(this.dataSource);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.array = x.result;
            this.totalSize = this.array.length;
          });
    }


  }

  onMonthSelect(e: any, monthcode: any) {

    if (e.isUserInput) {
      this.dbtDataService.GetDbtDataDeptSchemeFinyrMonthWise
        (this.dbtDataForm.value.deptCode ? this.dbtDataForm.value.deptCode : 0, this.dbtDataForm.value.schemeCode ? this.dbtDataForm.value.schemeCode : 0,
          this.dbtDataForm.value.finYrCode ? this.dbtDataForm.value.finYrCode : 0,
          monthcode, 0).subscribe(x => {
            //console.log(x.result);

            this.dataSource = new MatTableDataSource<DBTData>(x.result);
            //console.log(this.dataSource);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.array = x.result;
            this.totalSize = this.array.length;
          });
    }

  }

  searchdept(e: any) {
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

  searchScheme(e: any) {
    if (e !== undefined) {
      let term = '';
      if (e.target.value.length > 0) {
        term = e.target.value;
      }
      if (term !== undefined && term !== '' && term != null) {
        if (term.length > 0) {
          const lowerTerm = String(term).toLowerCase();
          this.schemeList = this.CopyschemeList?.filter((data: any) => {
            return String(data.schemeName).toLowerCase().indexOf(lowerTerm) >= 0 ||
              String(data.id).toLowerCase().indexOf(lowerTerm) >= 0;
          });
        }
      } else {
        this.schemeList = this.CopyschemeList;
      }
    }
  }

  displayFnDepartment(deptCode: Department): string {
    const dept = this.departmentList?.find((s: any) => s.deptCode === deptCode);
    return dept ? dept.name : '';
  }

  displayFnScheme(schemeCode: Scheme): string {
    const scheme = this.schemeList?.find((s: any) => s.id === schemeCode);
    return scheme ? scheme.schemeName : '';
  }
  displayFnFinancialYear(financialYear: CodeValues): string {
    const finYr = this.finYrList?.find((s: any) => s.codeValueId === financialYear);
    return finYr ? finYr.codeValueDesc : '';
  }
  displayFnMonth(month: Month): string {
    const mth = this.reportingMonthList?.find((s: any) => s.monthId === month);
    return mth ? mth.monthName : '';
  }

  searchFinYr(event: any) { }
  searchMonth(event: any) { }

  resetForm() {
    this.dbtDataForm.reset();
    this.selectDept = 0;
    this.schemeList = [];
    this.departmentList = this.copyDepartmentList;
    this.clearSelection();
    this.loadDataTable();
    //this.loadDataDependsOnDepartment(0);
  }

}
