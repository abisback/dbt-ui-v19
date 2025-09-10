import { Component, ViewChild } from '@angular/core';
import { CodeValues } from '../model/code-values.model';
import { Department } from '../model/department.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SchemeService } from '../service/scheme.service';
import { MasterService } from '../service/master.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HelperService } from '../service/helper.service';
import { DepartmentService } from '../service/department.service';
import { NotificationService } from '../service/notification.service';
import { MasterCodeType } from '../../app_enum';
import { MatTableDataSource } from '@angular/material/table';
import { Scheme } from '../model/scheme.model';
import { AddSchemeComponent } from './Add/add-scheme/add-scheme.component';
import { AddDraftSchemeComponent } from './add-draft-scheme/add-draft-scheme.component';
import { EditSchemeComponent } from './Edit/edit-scheme/edit-scheme.component';
import { SchemeDetailComponent } from './View/scheme-detail/scheme-detail.component';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-scheme',
  imports: [SharedModule],
  templateUrl: './scheme.component.html',
  styleUrl: './scheme.component.scss'
})
export class SchemeComponent {

  public array: any;
  displayedColumns: string[] = ['serialNo','deptName', 'schemeType', 'schemeName', 'schemeCode', 'progress', 'isActive', 'action'];
  dataSource: any;

  currentPage: number = 0;
  pageSize: number = 5;
  totalSize: number = 0;
  decisionTypeList: CodeValues[] = [];
  departmentList: Department[] = [];
  copyDepartmentList: Department[] = [];
  dept: any;
  searchForm !: FormGroup;
  isadmin:any;


  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private schemeService: SchemeService, private masterService: MasterService,
    public dialog: MatDialog, private toastr: ToastrService, public helper: HelperService,
    private departmentService: DepartmentService, private fb: FormBuilder, private notify: NotificationService) { }

  ngOnInit(): void {

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
this.copyDepartmentList = [...this.departmentList];
    });
    //debugger;
    this.masterService.getCodeValues(MasterCodeType.DecisionType).subscribe(x => {
      this.decisionTypeList = x;
    });
    this.loadDataTable(-1);
    this.searchForm = this.fb.group({
      searchString: ['']
    });
  }

  loadDataTable(deptId: any) {
    let deptCode: any = localStorage.getItem("deptCode");
    if (deptCode == null || deptCode == "") {
      deptCode = -1;
      this.dept = true;
    }

    this.schemeService.findSchemes(deptCode).subscribe(x => {
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
  private iterator() {
    const end = (this.currentPage + 1) * this.pageSize;
    const start = this.currentPage * this.pageSize;
    const part = this.array.slice(start, end);
    this.dataSource = part;
  }
  openAddDialog() {
    let role: any = localStorage.getItem("role");
    if(role == 'SADM')
      {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.panelClass = 'form-dialog';
        dialogConfig.width = '60%';
        dialogConfig.minWidth = '400px';
        dialogConfig.height = 'auto';

        const dialogRef = this.dialog.open(AddSchemeComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(response => {
          if (response != true) {
            this.toastr.success(response);
            this.loadDataTable(-1);
          }
        });

      }
      else{
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.panelClass = 'form-dialog';
        dialogConfig.width = '60%';
        dialogConfig.minWidth = '400px';
        dialogConfig.height = 'auto';

        const dialogRef = this.dialog.open(AddDraftSchemeComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(response => {
          if (response != true) {
            this.toastr.success(response);
            this.loadDataTable(-1);
          }
        });
      }

  }
  public handlePage(e: any) {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    //this.iterator();
  }

  toggleActive(element: any) {
    this.schemeService.ActivateDeactivateScheme(element).subscribe(response => {
      if (response.errorMessage == null) {
        this.toastr.success("Active status updated");
      } else {
        this.toastr.error(response.errorMessage);
      }
      this.loadDataTable(-1);
    });
  }







onToggleChange(event: any, element: any) {
  const newValue = event.value === 'true';

  // Only proceed if value is actually different
  if (element.isactive !== newValue) {
    this.notify.confirmProposal(
      'Are you sure?',
      'Do you really want to update the status?'
    ).then((confirmed) => {
      if (confirmed) {
        // Create payload with updated status
        const payload = {...element, isactive: newValue};

        this.schemeService.ActivateDeactivateScheme(payload.id).subscribe(response => {
          if (response.errorMessage == null) {
            this.toastr.success("Active status updated");
            // Update the status in data so it reflects in UI
            element.isactive = newValue;
          } else {
            this.toastr.error(response.errorMessage || "Error updating status");
            // Optional: reload data or force toggle back in UI
          }
        });
      } else {
        // If cancelled, revert the selection in UI by reloading data (for robust UX)
        // Or simply force the toggle back:
        this.loadDataTable(-1); // reload or refetch your data
      }
    });
  }
}























  applyFilter(event: Event) {
    // console.log(event.targ);
    // console.log(this.searchForm.value.searchString);
    //console.log(this.dataSource);
    this.dataSource.filter = this.searchForm.value.searchString!.trim().toLowerCase();
    // this.iterator();
    // console.log(this.dataSource);

    // const filterValue = (event.target as HTMLInputElement).value;
    // this.dataSource.filter = filterValue.trim().toLowerCase();

    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();
    // }
  }

  editScheme(element: Scheme) {
    console.log(element);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'form-dialog';
    dialogConfig.width = '60%';
    dialogConfig.minWidth = '400px';
    dialogConfig.height = '80%';

    dialogConfig.data = {
      eventData: element
    };

    //console.log(dialogConfig.data);
    const dialogRef = this.dialog.open(EditSchemeComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(response => {
      if (response != true) {
        this.toastr.success(response);
        this.loadDataTable(element.deptCode);
      }
    });
  }

  viewScheme(element: Scheme) {
    //console.log(element);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'form-dialog';
    dialogConfig.width = '60%';
    dialogConfig.minWidth = '400px';
    dialogConfig.height = '80%';
    dialogConfig.data = element;

    const dialogRef = this.dialog.open(SchemeDetailComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(response => {
      // if(response != true){
      //   this.toastr.success(response);
      // }
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
  displayFnDepartment(deptCode: Department): string {
    const dept = this.departmentList?.find((s: any) => s.deptCode === deptCode);
    return dept ? dept.name : '';
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

}
