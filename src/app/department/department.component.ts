import { Component, ViewChild } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { DepartmentService } from '../service/department.service';
import { MasterService } from '../service/master.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NotificationService } from '../service/notification.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CodeValues } from '../model/code-values.model';
import { MasterCodeType } from '../../app_enum';
import { MatTableDataSource } from '@angular/material/table';
import { Department } from '../model/department.model';
import { AddDepartmentComponent } from './Add/add-department/add-department.component';
import { DepartmentDetailComponent } from './View/department-detail/department-detail.component';
import { EditDepartmentComponent } from './edit-department/edit-department.component';

@Component({
  selector: 'app-department',
  imports: [SharedModule],
  templateUrl: './department.component.html',
  styleUrl: './department.component.scss'
})
export class DepartmentComponent {


  public array: any;
  displayedColumns: string[] = ['serialNo', 'nameCode', 'name', 'email', 'mobile', 'isactive', 'action'];
  //action
  dataSource: any;

  currentPage: number = 0;
  pageSize: number = 10;
  totalSize: number = 0;
  decisionTypeList: CodeValues[] = [];
  searchForm !: FormGroup;


  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private departmentService: DepartmentService, private masterService: MasterService,
    public dialog: MatDialog, private notify: NotificationService
    , private toastr: ToastrService, private fb: FormBuilder
  ) {

  }
  ngOnInit(): void {
    this.masterService.getCodeValues(MasterCodeType.DecisionType).subscribe(x => {
      this.decisionTypeList = x;
    });
    this.loadDataTable();

    this.searchForm = this.fb.group({
      searchString: ['']
    });
  }

  public handlePage(e: any) {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    //this.iterator();
  }

  loadDataTable() {
    this.departmentService.getDepartments().subscribe(x => {
      //  console.log(x);
      this.dataSource = new MatTableDataSource<Department>(x);
      //  console.log(this.dataSource);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.array = x;
      this.totalSize = this.array.length;
      //this.iterator();
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
  // toggleActive(element: any) {
  //   this.departmentService.ActivateDeactivateDepartment(element).subscribe(response => {
  //     if (response.errorMessage == null) {
  //       this.toastr.success("Active status updated");
  //     } else {
  //       this.toastr.success(response.errorMessage);
  //     }

  //   });
  // }



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

        this.departmentService.ActivateDeactivateDepartment(payload.deptCode).subscribe(response => {
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
        this.loadDataTable(); // reload or refetch your data
      }
    });
  }
}














  openAddDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'form-dialog';
    dialogConfig.width = '60%';
    dialogConfig.minWidth = '400px';
    dialogConfig.height = '100%';

    const dialogRef = this.dialog.open(AddDepartmentComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(response => {
      if (response != true) {
        this.toastr.success(response);
        this.loadDataTable();
      }
    });
  }
  viewDepartment(element: any) {
    //console.log(element);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'form-dialog';
    dialogConfig.width = '60%';
    dialogConfig.minWidth = '400px';
    dialogConfig.height = 'auto';
    dialogConfig.data = element;

    const dialogRef = this.dialog.open(DepartmentDetailComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(response => {
      // if(response != true){
      //   this.toastr.success(response);
      // }
    });


  }
  editDepartment(element: any) {
    //console.log(element);
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
    const dialogRef = this.dialog.open(EditDepartmentComponent, dialogConfig);

    // dialogRef.afterClosed().subscribe(response=>{
    //   if(response != true){
    //     this.toastr.success(response);
    //     this.loadDataTable(element.deptCode);
    //   }
    // });

  }
}
