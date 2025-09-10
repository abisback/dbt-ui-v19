import { Component, ViewChild } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { Department } from '../../model/department.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CodeValues } from '../../model/code-values.model';
import { Scheme } from '../../model/scheme.model';
import { DBTData } from '../../model/dbtdata.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HelperService } from '../../service/helper.service';
import { DepartmentService } from '../../service/department.service';
import { SchemeService } from '../../service/scheme.service';
import { MatTableDataSource } from '@angular/material/table';
import { SchemeDetailComponent } from '../View/scheme-detail/scheme-detail.component';
import { EditApprovalSchemeComponent } from '../edit-approval-scheme/edit-approval-scheme.component';

@Component({
  selector: 'app-approve-scheme',
  imports: [SharedModule],
  templateUrl: './approve-scheme.component.html',
  styleUrl: './approve-scheme.component.scss'
})
export class ApproveSchemeComponent {

  public array: any;
  displayedColumns: string[] = ['serialNo','deptName', 'schemeType', 'schemeName', 'schemeCode', 'progress', 'action'];
  dataSource: any;

  currentPage: number = 0;
  pageSize: number = 5;
  totalSize: number = 0;
 // decisionTypeList: CodeValues[] = [];
  departmentList: Department[] = [];
  dept: any;
  searchForm !: FormGroup;
  isadmin:any;
  //schemeService: any;

  decisionTypeList: CodeValues[] = [];
  isTableExpanded = false;
  checked: any;
  clickedRows = new Set<any>();
  isRowClicked: boolean = false;
  clickedRowsArray: any[] = [];
  schemeList: Scheme[] = [];
  selectDept: number = 0;
  admin: any;
  filterData: DBTData[] = [];
  roleid:any;

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    public dialog: MatDialog,
    private toastr: ToastrService,
    public helper: HelperService,
    private departmentService: DepartmentService,
    private schemeService: SchemeService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      searchString: ['']
    })
    this.departmentService.getDepartments().subscribe(x => {
      //this.departmentList = x;
      this.departmentList.push({deptCode: -1,
        name: 'All',
        nameCode: '',
        name_Symbol: '',
        mobile: '',
        email: '',
        status: 0,
        isactive: true,
        createdOn: '',
        modifiedOn: '',
        createdBy: '',
        modifiedBy:'',
         });
        x.forEach(elm => {
          this.departmentList.push(elm);
        });
    });

    this.loadDataTable();
  }

  applyFilter(event: Event) {
    this.dataSource.filter = this.searchForm.value.searchString!.trim().toLowerCase();
  }

  loadDataTable() {
    // let deptCode: any = localStorage.getItem("deptCode");
    // if (deptCode == null || deptCode == "") {
    //   deptCode = -1;
    //   this.dept = true;
    // }

    this.schemeService.findSchemesForApproval().subscribe(x => {
      console.log(x);
      this.dataSource = new MatTableDataSource<Scheme>(x);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.array = x;
      this.totalSize = this.array.length;
      //console.log(this.dataSource.filteredData);
      //this.iterator();
    });
  }
  public handlePage(e: any) {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    //this.iterator();
  }

  viewScheme(element: Scheme) {
    //console.log(element);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'form-dialog';
    dialogConfig.width = '60%';
    dialogConfig.minWidth = '400px';
    dialogConfig.height = '100%';
    dialogConfig.data = element;

    const dialogRef = this.dialog.open(SchemeDetailComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(response => {
      // if(response != true){
      //   this.toastr.success(response);
      // }
    });


  }

  editScheme(element: Scheme) {
    console.log(element);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'form-dialog';
    dialogConfig.width = '60%';
    dialogConfig.minWidth = '400px';
    dialogConfig.height = '100%';

    dialogConfig.data = {
      eventData: element
    };

    //console.log(dialogConfig.data);
    const dialogRef = this.dialog.open(EditApprovalSchemeComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(response => {
      if (response != true) {
        this.toastr.success(response);
        this.loadDataTable();
      }
    });
  }

  onDepartmentSelect(e: any, deptcode: any) {
    //console.log(e);
    if (e.isUserInput) {
      this.loaddata(deptcode);
    }

  }
  loaddata(deptcode: any) {
    this.schemeService.findSchemes(deptcode).subscribe(x => {
      //console.log(x);
      this.dataSource = new MatTableDataSource<Scheme>(x);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.array = x;
      this.totalSize = this.array.length;
      //console.log(this.dataSource.filteredData);
      //this.iterator();
    });
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

}
