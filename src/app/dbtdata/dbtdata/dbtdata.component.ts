import { Component, ElementRef, ViewChild } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CodeValues } from '../../model/code-values.model';
import { Department } from '../../model/department.model';
import { Scheme } from '../../model/scheme.model';
import { Month } from '../../model/month.model';
import { User } from '../../model/user.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DbtdataService } from '../../service/dbtdata.service';
import { RemarksService } from '../../service/remarks.service';
import { MasterService } from '../../service/master.service';
import { DepartmentService } from '../../service/department.service';
import { SchemeService } from '../../service/scheme.service';
import { MonthService } from '../../service/month.service';
import { UserService } from '../../service/user.service';
import { NotificationService } from '../../service/notification.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MasterCodeType, USERROLE } from '../../../app_enum';
import * as XLSX from 'xlsx';
import { DBTData } from '../../model/dbtdata.model';
import { MatTableDataSource } from '@angular/material/table';
import { AddDbtdataNewversionComponent } from '../add-dbtdata-newversion/add-dbtdata-newversion.component';
import { DbtdataDetailComponent } from '../View/dbtdata-detail/dbtdata-detail.component';
import { EditDbtComponent } from '../../edit-dbt/edit-dbt.component';

@Component({
  selector: 'app-dbtdata',
  imports: [SharedModule],
  templateUrl: './dbtdata.component.html',
  styleUrl: './dbtdata.component.scss'
})
export class DbtdataComponent {

  dbtDataForm!: FormGroup;
  public array: any;
  displayedColumns: string[] = ['serialNo', 'deptName', 'schemeName', 'financialYear', 'reportingMonthName', 'totalBen', 'fundTrnsferCash', 'status', 'isActive', 'action'];
  //action
  dataSource: any;
  checked: any;
  currentPage: number = 0;
  pageSize: number = 10;
  totalSize: number = 0;
  decisionTypeList: CodeValues[] = [];
  deptList: Department[] = [];
  schemeList: Scheme[] = [];
  copySchemeList: Scheme[] = [];
  monthList: Month[] = [];
  finYrList: CodeValues[] = [];
  roleid: any;
  admin: any;
  //departmentList: Department[] = [];
  departmentList: any[] = [];
  copyDepartmentList: any[] = [];

  selectDept: number = 0;
  roles: CodeValues[] = [];
  filterData: User[] = [];
  financialYear: any;
  reportingMonthList: Month[] = [];
  searchForm !: FormGroup;

  showAddButton: boolean = false;
  show: boolean = true;
  searchControl = new FormControl('');
  filterForm = new FormGroup({
    deptCode: new FormControl(),
    schemeCode: new FormControl(),
    yearCode: new FormControl(),
    monthCode: new FormControl()
  })

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('TABLE') table: ElementRef | undefined;

  constructor(private dbtDataService: DbtdataService,
    private remarksService: RemarksService, //
    private masterService: MasterService,
    private deptService: DepartmentService,
    private schemeService: SchemeService,
    private monthService: MonthService,
    private userService: UserService,
    private departmentService: DepartmentService,
    public dialog: MatDialog, private notify: NotificationService
    , private toastr: ToastrService, private fb: FormBuilder
  ) {

  }
  ngOnInit(): void {
    //debugger;
    let role = localStorage.getItem('role');
    this.roleid = localStorage.getItem('role');
    //console.log(this.roleid);
    let schemecode = localStorage.getItem('schemeCode');
    //console.log(schemecode);
    if ((role == USERROLE['Department Operator'])) {
      this.show = false;
      this.displayedColumns = ['serialNo', 'schemeName', 'financialYear', 'reportingMonthName', 'totalBen', 'fundTrnsferCash', 'status', 'action'];
    }
    if ((role == USERROLE['Department Operator']) || (role == USERROLE['Department Admin']) || (role == USERROLE['Department Nodal'])) {
      this.showAddButton = true;
    } else {
      this.showAddButton = false;
    }

    this.masterService.getCodeValues(MasterCodeType.DecisionType).subscribe(x => {
      this.decisionTypeList = x;
      //console.log(this.decisionTypeList);
    });
    this.masterService.getCodeValues(MasterCodeType.Financial_Year).subscribe(x => {

      this.finYrList.push({
        Id: 0,
        codeTypeId: 0,
        codeValueDesc: "ALL",
        codeValueId: 0,
      });
      x.forEach(elm => {
        this.finYrList.push(elm);
      });


      //this.finYrList = x;
      console.log(this.finYrList);
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

    let deptCode = localStorage.getItem('deptCode');
    let a = this.deptService.encryptPassword(deptCode);
    //console.log(btoa(a));
    let enccd = btoa(a);
    if (deptCode != '' && deptCode != null) {
      this.deptService.GetDepartment(enccd).subscribe(x => {
        this.deptList.push(x.result);
        // console.log(this.deptList);
      });
    } else {
      this.deptService.getDepartments().subscribe(x => {
        this.deptList = x;
      });
    }
    this.departmentService.getDepartments().subscribe(x => {
      //this.departmentList = x;
      this.departmentList.push({ name: 'All', deptCode: 0 });
      x.forEach(elm => {
        this.departmentList.push(elm);
      });
      // If you want to COPY this list elsewhere
      this.copyDepartmentList = [...this.departmentList];
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
  displayFnDepartment(deptCode: Department): string {
    const dept = this.departmentList?.find((s: any) => s.deptCode === deptCode);
    return dept ? dept.name : '';
  }

  getSerialNumber(index: number): number {
    //console.log(index);
    return index + 1;
  }

  exportToExcel(): void {
    // const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource);
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table?.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'department-wise-mis-report' + Date().valueOf() + '.xlsx')
  }

  // exportToPdf(): void {
  //   const doc = new jsPDF();
  //   doc.autoTable({ html: '#mat-table' });
  //   const fileName = 'export.pdf';
  //   doc.save(fileName);
  // }


  getRowStyle(row: any) {
    //console.log(row.submition_flag);

    if (row.submition_flag == 0) {
      return { backgroundColor: '' }; // Apply yellow background for condition 'value1'
    } else {
      return { background: 'linear-gradient(0deg, rgb(255 255 255) 0%, rgb(168 197 223) 100%)' }; // Light gradient background for table row
    }
  }

  getRowTooltip(row: any) {
    return row.submition_flag == 0 ? "API base data entry" : "Form base data entry";
  }

  public handlePage(e: any) {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    //this.iterator();
  }

  changeDepartment(event: any) {
    this.schemeService.findActiveSchemes(event.value).subscribe(x => {
      this.schemeList = x;
    });
  }

  onDepartmentSelect(e: any, deptcode: any) {
    //console.log(e);
    if (e.isUserInput) {

      this.schemeService.findActiveSchemes(deptcode).subscribe(x => {
        //console.log(x);
        this.schemeList = this.copySchemeList = x;
        //this.iterator();
      });
      this.selectDept = deptcode;
      //this.loaddata(deptcode);
      // this.dbtDataService.AllDBTDataByDept(deptcode).subscribe(x => {
      //   console.log(x.result);
      //   this.dataSource = new MatTableDataSource<DBTData>(x.result);
      //   //console.log(this.dataSource);
      //   this.dataSource.paginator = this.paginator;
      //   this.array = x;
      //   this.totalSize = this.array.length;
      //   //this.iterator();
      // });

      this.dbtDataService.GetAllListByDeptSchemeFinyrMonth
        (deptcode, this.dbtDataForm.value.schemeCode ? this.dbtDataForm.value.schemeCode : 0,
          this.dbtDataForm.value.finYrCode ? this.dbtDataForm.value.finYrCode : 0,
          this.dbtDataForm.value.monthCode ? this.dbtDataForm.value.monthCode : 0).subscribe(x => {
            //console.log(x.result);
            this.configureDataSource(x.result);
            this.array = x.result;
            this.totalSize = this.array.length;
          });
    }

  }

  onSchemeSelect(e: any, schemeId: any) {
    //console.log(roleId);
    if (e.isUserInput) {

      this.dbtDataService.GetAllListByDeptSchemeFinyrMonth(this.dbtDataForm.value.deptCode ? this.dbtDataForm.value.deptCode : 0, schemeId,
        this.dbtDataForm.value.finYrCode ? this.dbtDataForm.value.finYrCode : 0,
        this.dbtDataForm.value.monthCode ? this.dbtDataForm.value.monthCode : 0).subscribe(x => {
          //console.log(x.result);
          this.configureDataSource(x.result);
          this.array = x.result;
          this.totalSize = this.array.length;
        });
    }

  }

  onFinancialYearSelect(e: any, finyrcode: any) {
    if (e.isUserInput) {
      this.dbtDataService.GetAllListByDeptSchemeFinyrMonth
        (this.dbtDataForm.value.deptCode ? this.dbtDataForm.value.deptCode : 0, this.dbtDataForm.value.schemeCode ? this.dbtDataForm.value.schemeCode : 0,
          finyrcode,
          this.dbtDataForm.value.monthCode ? this.dbtDataForm.value.monthCode : 0).subscribe(x => {
            //console.log(x.result);
            this.configureDataSource(x.result);
            this.array = x.result;
            this.totalSize = this.array.length;
          });
    }


  }

  onMonthSelect(e: any, monthcode: any) {

    if (e.isUserInput) {
      this.dbtDataService.GetAllListByDeptSchemeFinyrMonth
        (this.dbtDataForm.value.deptCode ? this.dbtDataForm.value.deptCode : 0, this.dbtDataForm.value.schemeCode ? this.dbtDataForm.value.schemeCode : 0,
          this.dbtDataForm.value.finYrCode ? this.dbtDataForm.value.finYrCode : 0,
          monthcode).subscribe(x => {
            //console.log(x.result);
            this.configureDataSource(x.result);
            this.array = x.result;
            this.totalSize = this.array.length;
          });
    }

  }

  // Working
  onFilterSubmit() {
    alert("Test");
    //console.log(JSON.stringify(this.filterForm.value));
  }
  loadDataTable() {
    let deptCode = localStorage.getItem('deptCode');
    if (deptCode == null || deptCode == "") {
      //deptCode = -1;
      //this.departmentCode = -1;
      this.admin = true;
    }
    this.dbtDataService.getDBTDataByDept().subscribe(x => {
      // console.log(x);
      this.configureDataSource(x);
      this.array = x;
      this.totalSize = this.array.length;
      // this.iterator();
    });
    // this.dbtDataService.getDBTDataByDept(deptCode).subscribe(x =>{
    //   //console.log(x);
    //   this.dataSource = new MatTableDataSource<DBTData>(x);
    //  //console.log(this.dataSource);
    //   this.dataSource.paginator = this.paginator;
    //   this.array = x;
    //   this.totalSize = this.array.length;
    //   this.iterator();
    // });
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

  private configureDataSource(rows: DBTData[]): void {
    this.dataSource = new MatTableDataSource<DBTData>(rows);
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
      // Try to capture a 4-digit start year like 2023 from formats like "2023-24" or "FY 2023-24"
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
  // toggleActive(element: any) {
  //   this.dbtDataService.ActivateDeactivateDBTData(element).subscribe(response => {
  //     if (response.errorMessage == null) {
  //       this.toastr.success("Active status updated");
  //     } else {
  //       this.toastr.success(response.errorMessage);
  //     }

  //   });
  // }



  onToggleChange(event: any, element: any) {
    const newValue = event.value === 'true';

    // Only proceed if user selected different value
    if (element.isActive !== newValue) {
      // — Show your confirmation dialog (assume a promise-based function)
      this.notify.confirmProposal('Are you sure?', 'Do you really want to update the status?').then((confirmed) => {
        if (confirmed) {
          // Make a copy with updated value
          const payload = { ...element, isActive: newValue };
          this.dbtDataService.ActivateDeactivateDBTData(payload.id).subscribe(response => {
            if (!response.errorMessage) {
              this.toastr.success("Active status updated");
              // Update the UI to reflect the new status
              element.isActive = newValue;
            } else {
              this.toastr.error(response.errorMessage || "Error updating status");
              // Optional: revert selection
              this.forceToggleRefresh();
            }
          });
        } else {
          // User cancelled: Revert the selection visually
          this.forceToggleRefresh();
        }
      });
    }
  }

  // Helper to refresh/re-render (reload data for robustness)
  forceToggleRefresh() {
    // You can either reload the table/list, or force UI refresh logic
    this.loadDataTable();
    // Or view logic: update [value] of toggle group by changing reference/object
  }













  openAddDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'form-dialog';
    dialogConfig.width = '60%';
    dialogConfig.minWidth = '400px';
    dialogConfig.height = '80%';


    const dialogRef = this.dialog.open(AddDbtdataNewversionComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(response => {
      if (response != true) {
        this.toastr.success(response);
        this.loadDataTable();
      }
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

  onEditClick(event: any, reportingMonth: any) {
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

  onEditClickDraft(event: any, reportingMonth: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'form-dialog';
    dialogConfig.width = '60%';
    dialogConfig.minWidth = '400px';
    dialogConfig.height = '80%';

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
  getCheckedItems() {
    //this.checked = this.items.filter(i => i.checked == true);
    this.checked = true;
  }
  masterToggle() {
    // this.isAllSelected() ? this.clickedRows.clear() : this.allotSource.filteredData.forEach((row: any) => this.clickedRows.add(row));
    // if (this.clickedRows.size) this.isRowClicked = true;
    // else this.isRowClicked = false;
  }

  isAllSelected() {
    // const numSelected = this.clickedRows.size;
    // const numRows = this.allotSource.filteredData.length;
    // return numSelected === numRows;
  }

  tickRow(event: any, row: any) {
    // const rowSelected = this.clickedRows.size;
    // this.clickedRows.has(row) ? this.clickedRows.delete(row) : this.clickedRows.add(row);
    // if (this.clickedRows.size) this.isRowClicked = true;
    // else this.isRowClicked = false;
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
          this.schemeList = this.copySchemeList?.filter((data: any) => {
            return String(data.schemeName).toLowerCase().indexOf(lowerTerm) >= 0 ||
              String(data.id).toLowerCase().indexOf(lowerTerm) >= 0;
          });
        }
      } else {
        this.schemeList = this.copySchemeList;
      }
    }
  }

  searchFinYr(event: any) { }
  searchMonth(event: any) { }

  resetForm() {
    this.dbtDataForm.reset();
    this.selectDept = 0;
    this.schemeList = [];
    this.departmentList = this.copyDepartmentList;
    // this.clearSelection();
    this.loadDataTable();
    console.log(this.schemeList);
    this.searchControl.setValue('');

  }
}
