import { Component, ViewChild } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { Department } from '../model/department.model';
import { Scheme } from '../model/scheme.model';
import { CodeValues } from '../model/code-values.model';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { SchemeService } from '../service/scheme.service';
import { DepartmentService } from '../service/department.service';
import { HelperService } from '../service/helper.service';
import { MasterService } from '../service/master.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MasterCodeType } from '../../app_enum';
import { MatTableDataSource } from '@angular/material/table';
import { SchemeBudget } from '../model/scheme-budget.model';
import { SchemeBudgetDetailComponent } from './View/scheme-budget-detail/scheme-budget-detail.component';
import { AddSchemeBudgetComponent } from './Add/add-scheme-budget/add-scheme-budget.component';

@Component({
  selector: 'app-scheme-budget',
  imports: [SharedModule],
  templateUrl: './scheme-budget.component.html',
  styleUrl: './scheme-budget.component.scss'
})
export class SchemeBudgetComponent {

  displayedColumns: string[] = ['financialYear', 'centralAllocation', 'stateAllocation', 'additionalAllocation', 'totalAllocation', 'isActive', 'action'];
  dataSource: any;
  public array: any;
  currentPage: number = 0;
  pageSize: number = 5;
  totalSize: number = 0;

  public displayScheme: boolean;
  public displaySchemeBudgetDetails: boolean;
  departmentList: Department[] = [];
  schemeList: Scheme[] = [];
  decisionTypeList: CodeValues[] = [];
  public selectedScheme: any;
  public department = new FormControl();

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined

  constructor(private schemeService: SchemeService,
    private departmentService: DepartmentService,
    public helperService: HelperService,
    private masterService: MasterService,
    private toastr: ToastrService,
    public dialog: MatDialog) {
    this.displayScheme = false;
    this.displaySchemeBudgetDetails = false;
  }

  ngOnInit(): void {
    //debugger;
    let deptCode = localStorage.getItem("deptCode");

    let a = this.departmentService.encryptPassword(deptCode);
    //console.log(btoa(a));
    let enccd = btoa(a);
    if (deptCode == null || deptCode == "") {
      this.departmentService.getDepartments().subscribe(x => {
        this.departmentList = x;
      });
    } else {
      this.departmentService.GetDepartment(enccd).subscribe(x => {
        this.departmentList.push(x.result);
      });
      //this.departmentChange(deptCode);
    }
    this.masterService.getCodeValues(MasterCodeType.DecisionType).subscribe(x => {
      this.decisionTypeList = x;
      //console.log(this.decisionTypeList);
    });
  }

  departmentChange(event: any) {
    //console.log("Hello:" +event.value);
    this.schemeService.findActiveSchemes(event.value).subscribe(x => {
      this.schemeList = x;
      // console.log(x);
      if (x.length > 0) {
        this.displayScheme = true;
      } else {
        this.displayScheme = false;
        this.displaySchemeBudgetDetails = false;
        this.toastr.error("Related Scheme/s not found for this department. Please add a scheme first.");
      }

    });
  }
  schemeChange(event: any) {
    //console.log(event.value);
    this.displaySchemeBudgetDetails = true;
    this.selectedScheme = this.schemeList.filter(s => s.id == event.value)[0];
    //console.log(this.selectedScheme);
    this.loadDataTable(this.selectedScheme.id);
  }

  loadDataTable(schemeId: number) {
    this.schemeService.findSchemeBudgets(false, schemeId).subscribe(x => {
      //console.log(x);
      this.dataSource = new MatTableDataSource<Scheme>(x);
      this.dataSource.paginator = this.paginator;
      this.array = x;
      this.totalSize = this.array.length;
      //this.iterator();
    });
  }
  private iterator() {
    const end = (this.currentPage + 1) * this.pageSize;
    const start = this.currentPage * this.pageSize;
    const part = this.array.slice(start, end);
    this.dataSource = part;
  }

  public handlePage(e: any) {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    this.iterator();
  }

  toggleActive(element: any) {
    this.schemeService.ActivateDeactivateSchemeBudget(element).subscribe(response => {
      if (response.errorMessage == null) {
        this.toastr.success("Active status updated");
      } else {
        this.toastr.error(response.errorMessage);
      }
      this.loadDataTable(this.selectedScheme.id);
    });
  }

  viewSchemeBudget(element: SchemeBudget) {
    element.scheme = this.selectedScheme;
    // console.log(element);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'form-dialog';
    dialogConfig.width = '60%';
    dialogConfig.minWidth = '400px';
    dialogConfig.height = '100%';
    dialogConfig.data = element;

    const dialogRef = this.dialog.open(SchemeBudgetDetailComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(response => {
      // if(response != true){
      //   this.toastr.success(response);
      // }
    });
  }

  addSchemeBudget() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'form-dialog';
    dialogConfig.width = '60%';
    dialogConfig.minWidth = '400px';
    dialogConfig.height = '100%';
    dialogConfig.data = this.selectedScheme;

    const dialogRef = this.dialog.open(AddSchemeBudgetComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(response => {
      if (response != true) {
        this.toastr.success(response);
        this.loadDataTable(this.selectedScheme.id);
      }
    });
  }

}
