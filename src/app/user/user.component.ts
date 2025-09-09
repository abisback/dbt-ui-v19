import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddUserComponent } from './Add/add-user/add-user.component';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../service/user.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { User } from '../model/user.model';
import { MatIconModule } from '@angular/material/icon';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { Department } from '../model/department.model';
import { DepartmentService } from '../service/department.service';
import { CodeValues } from '../model/code-values.model';
import { NotificationService } from '../service/notification.service';
import { EditUserComponent } from './Edit User/edit-user/edit-user.component';
import { environment } from '../../environments/environment';
import { ShowPasswordComponent } from '../show-password/show-password.component';
import { MasterService } from '../service/master.service';
import { MasterCodeType } from '../../app_enum';
import * as CryptoJS from "crypto-js";

@Component({
  selector: 'app-user',
  imports: [SharedModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {
  departmentCode: any;
  admin: boolean = false;
  displayedColumns: string[] = ['serialNo', 'userId', 'deptCode', 'role', 'firstName', 'middleName', 'lastName', 'email', 'phoneNo', 'isActive', 'action', 'newpass'];
  dataSource: any;
  currentPage: number = 0;
  pageSize: number = 10;
  totalSize: number = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort;
  array!: User[];
  departmentList: Department[] = [];
  selectDept: number = -1;
  decisionTypeList: CodeValues[] = [];
  roles: CodeValues[] = [];
  filterData: User[] = [];
  copyDepartmentList: Department[] = [];

  constructor(
    public dialog: MatDialog,
    private toastr: ToastrService,
    private userService: UserService,
    private departmentService: DepartmentService,
    private notify: NotificationService,
    private masterService: MasterService,
  ) {

  }
  searchForm: FormGroup = new FormGroup({
    searchString: new FormControl(""),
    roleCode: new FormControl("", Validators.required),
    deptCode: new FormControl("", Validators.required),
  });


  ngOnInit(): void {

    this.masterService.getCodeValues(MasterCodeType.DecisionType).subscribe(x => {
      this.decisionTypeList = x;
    });
    this.departmentService.getDepartments().subscribe(x => {
      //this.departmentList = x;
      this.departmentList.push({
        deptCode: -1,
        name: 'All',
        name_Code: '',
        name_Symbol: '',
        mobile: '',
        email: '',
        status: 0,
        isactive: true,
        createdOn: '',
        modifiedOn: '',
        createdBy: '',
        modifiedBy: '',
      });
      x.forEach((elm: Department) => {
        this.departmentList.push(elm);
      });
      // If you want to COPY this list elsewhere
      this.departmentList = [...this.departmentList];
    });

    this.masterService.getCodeValues(MasterCodeType.Roles).subscribe(x => {
      this.roles = x.filter(a => a.codeValueId == 'DADM' || a.codeValueId == 'DNOD' || a.codeValueId == 'DOPT');
      //console.log(this.decisionTypeList);
    });
    this.loadDataTable();
  }

  openAddDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'form-dialog';
    dialogConfig.width = '60%';
    dialogConfig.minWidth = '410px';
    dialogConfig.height = 'auto';
    dialogConfig.minHeight = 'auto';

    const dialogRef = this.dialog.open(AddUserComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(response => {
      if (response != true) {
        this.toastr.success(response);
        this.loadDataTable();
      }
    });
  }
  loadDataTable() {
    let deptCode: any = localStorage.getItem("deptCode");
    if (deptCode == null || deptCode == "") {
      deptCode = -1;
      this.departmentCode = -1;
      this.admin = true;
    }
    this.userService.findUsers(deptCode, '', 'asc', 1, 20).subscribe(x => {
      //  console.log(x);
      this.dataSource = new MatTableDataSource(x);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.array = x;
      this.totalSize = this.array.length;
      // this.iterator();
    });

    // this.userService.GetUserProfileByDeptRole(this.selectDept ? this.selectDept : deptCode, this.searchForm.value.roleCode ? this.searchForm.value.roleCode : -1).subscribe(x => {
    //   this.filterData = x;
    //   //console.log(this.selectDept);
    //   this.dataSource = new MatTableDataSource(x);
    //   this.dataSource.paginator = this.paginator;
    //   // this.dataSource.sort = this.sort;
    //   this.array = x;
    //   this.totalSize = this.array.length;
    // });

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
          this.departmentList = this.departmentList?.filter((data: any) => {
            return String(data.name).toLowerCase().indexOf(lowerTerm) >= 0 ||
              String(data.code).toLowerCase().indexOf(lowerTerm) >= 0;
          });
        }
      } else {
        this.departmentList = this.departmentList;
      }
    }
  }
  displayFnDepartment(deptCode: Department): string {
    const dept = this.departmentList?.find((s: any) => s.deptCode === deptCode);
    return dept ? dept.name : '';
  }
  onDepartmentSelect(e: any, deptcode: any) {
    //console.log(e);


    if (e.isUserInput) {
      this.selectDept = deptcode;
      //this.loaddata(deptcode);
      this.userService.findUsers(deptcode, '', 'asc', 1, 20).subscribe(x => {
        //  console.log(x);
        this.dataSource = new MatTableDataSource(x);
        this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
        this.array = x;
        this.totalSize = this.array.length;
        // this.iterator();
      });
    }
    // this.userService.GetUserProfileByDeptRole(deptcode, this.searchForm.value.roleCode ? this.searchForm.value.roleCode : -1).subscribe(x => {
    //   this.filterData = x;
    //   //console.log(this.selectDept);
    //   this.dataSource = new MatTableDataSource(x);
    //   this.dataSource.paginator = this.paginator;
    //   // this.dataSource.sort = this.sort;
    //   this.array = x;
    //   this.totalSize = this.array.length;
    // });

    // if (this.selectDept == -1) {
    //   this.searchForm.get('roleCode')?.reset();
    // }
  }

  displayFnRole(role: CodeValues): string {
    const roleItem = this.roles?.find((s: any) => s.codeValueId === role);
    return roleItem ? roleItem.codeValueDesc : '';
  }

  onRoleSelect(e: any, roleId: any) {
    //console.log(roleId);
    if (e.isUserInput) {
      this.userService.GetUserProfileByDeptRole(this.selectDept, roleId).subscribe(x => {
        this.filterData = x;
        //console.log(this.selectDept);
        this.dataSource = new MatTableDataSource(x);
        this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
        this.array = x;
        this.totalSize = this.array.length;

      });
    }

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
  resetForm() {
    this.searchForm.reset();
    this.selectDept = -1;
    this.loadDataTable();
    this.departmentList = this.copyDepartmentList;
  }
  onToggleChange(event: any, element: any) {
    const newValue = event.value;
    const current = element.isActive ? 'true' : 'false';
    if (newValue !== current) {
      // Show confirm dialog
      this.notify.confirmProposal('Are you sure?', 'Do you really want to update?').then((res) => {
        if (res) {
          const updatedElement = { ...element, isActive: newValue === 'true' };

          this.userService.ActivateDeactivateUser(updatedElement.id).subscribe(response => {
            if (!response.errorMessage) {
              this.toastr.success("Active status updated");
            } else {
              this.toastr.error(response.errorMessage);
            }
            this.loadDataTable();
          });
        } else {
          // If cancelled, revert UI selection by reloading table or resetting the group
          this.loadDataTable();
        }
      });
    }
  }
  openEditDialog(event: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'form-dialog';
    dialogConfig.width = '60%';
    dialogConfig.minWidth = '400px';
    dialogConfig.height = 'auto';

    dialogConfig.data = {
      eventData: event
    };

    //console.log(dialogConfig.data);
    const dialogRef = this.dialog.open(EditUserComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(response => {
      if (response != true) {
        this.toastr.success(response);
        this.loadDataTable();
      }
    });
  }
  openPopUp(event: any) {
    // console.log(btoa("arpan"));
    // console.log(atob("YXJwYW4="));
    const key = CryptoJS.enc.Utf8.parse(environment.AesKey);
    const iv = CryptoJS.enc.Utf8.parse(environment.AesIV);
    let obj = {};

    obj = {
      Password: null,
      userId: event
    };
    this.userService.RegeneratePassword(obj).subscribe(resp => {
      //console.log(resp['result'].password);
      //this.toastr.success('Your New Password is '+ resp['result'].password);

      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.panelClass = 'form-dialog';
      dialogConfig.width = '60%';
      dialogConfig.minWidth = '40px';
      //dialogConfig.data = element;
      dialogConfig.data = {
        eventData: resp['result'].password,
      };
      //dialogConfig.height = '100%';

      const dialogRef = this.dialog.open(ShowPasswordComponent, dialogConfig);
      //this.dialogRef.close('User Succesfully Registered');
    });

  }
  public handlePage(e: any) {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    // this.iterator();
  }
}
