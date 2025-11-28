import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, ViewChild } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DashboardService } from '../../service/dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { MasterService } from '../../service/master.service';
import { MasterCodeType } from '../../../app_enum';
// import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-extended-dbt-data',
  imports: [SharedModule],
  templateUrl: './extended-dbt-data.component.html',
  styleUrl: './extended-dbt-data.component.scss',
  animations: [
    trigger('detailExpand', [
      state(
        'collapsed',
        style({ height: '0px', minHeight: '0', color: 'red' })
      ),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class ExtendedDbtDataComponent {
  dataSource: any;
  finYrList: any[] = [];
  financialYearId: string = '';
  selectedFinYear: string = '';
  displayedColumns: string[] = [
    // 'Sno',
    'departmentName',
    'beneficiaryCount',
    'action',
  ];

  currentPage: number = 0;
  pageSize: number = 5;
  totalSize: number = 0;
  expandedElement: any | null;

  clickedRows = new Set<any>();

  @ViewChild('paginator') paginator!: MatPaginator;

  constructor(
    private dashboardService: DashboardService,
    private toaster: ToastrService,
    private masterService: MasterService,
    // private fb: FormBuilder,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadDepartmentList();
    this.loadFinancialYearList();
  }

  getRowStyle(row: any) {
    if (row.submition_flag == 0) {
      return { backgroundColor: '' }; // Apply yellow background for condition 'value1'
    } else {
      return {
        background:
          'linear-gradient(0deg, rgb(255 255 255) 0%, rgb(168 197 223) 100%)',
      }; // Return empty object if no condition matches
    }
  }
  handlePage(e: any) {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
  }
  loadDepartmentList(): void {
    this.dashboardService.GetAllDepartmentCount().subscribe((res: any) => {
      if (res.apiResponseStatus == 1) {
        this.dataSource = new MatTableDataSource(res.result);
        this.dataSource.paginator = this.paginator;
      } else {
        this.toaster.error(res.errorMessage);
      }
    });
  }
  // getExpandedDetails(deptCode: any, element: any) {
  //   element.isExpanded = !element.isExpanded;
  //   if (element.isExpanded === true) {
  //     // console.log('deptCode :>> ', element.isExpanded);
  //     this.dashboardService
  //       .GetSchemeListDetails(deptCode, this.financialYearId)
  //       .subscribe((res: any) => {
  //         if (res.apiResponseStatus == 1) {
  //           // console.log('res.result :>> ', res.result);
  //           element.schemes = res.result;
  //         } else {
  //           this.toaster.error(res.errorMessage);
  //         }
  //       });
  //   }
  // }


getExpandedDetails(deptCode: any, element: any) {
  // If some other row is already expanded, close it
  if (this.expandedElement && this.expandedElement !== element) {
    this.expandedElement.isExpanded = false;
  }

  // Toggle current row
  element.isExpanded = !element.isExpanded;

  // Update tracker
  this.expandedElement = element.isExpanded ? element : null;

  if (element.isExpanded === true) {
    this.dashboardService
      .GetSchemeListDetails(deptCode, this.financialYearId)
      .subscribe((res: any) => {
        if (res.apiResponseStatus == 1) {
          element.schemes = res.result;
        } else {
          this.toaster.error(res.errorMessage);
        }
      });
  }
}




  displayFinancialYearFn(finYearId: number): string {
    // Find the financial year by ID
    const finYear = this.finYrList.find(
      (f: any) => f.codeValueId === finYearId
    );
    return finYear ? finYear.codeValueDesc : '';
  }
  // onFinancialYearSelect(event: any, finYearId: any): void {
  //   if (event.isUserInput) {
  //     this.financialYearId = finYearId;
  //     if (this.expandedElement?.isExpanded === true) {
  //       this.expandedElement.isExpanded = false;
  //     }

  //   }
  // }



  onFinancialYearSelect(event: any, finYearId: any): void {
  if (event.isUserInput) {
    this.financialYearId = finYearId;
    if (this.expandedElement?.isExpanded === true) {
      this.expandedElement.isExpanded = false;
    }
  }
}

  loadFinancialYearList(): void {
    this.masterService
      .getCodeValues(MasterCodeType.Financial_Year)
      .subscribe((x: any) => {
        this.finYrList = x.sort(
          (a: { codeValueDesc: string }, b: { codeValueDesc: string }) =>
            b.codeValueDesc.localeCompare(a.codeValueDesc)
        );
      });
  }
  ngOnDestroy(): void {
    window.removeEventListener('beforeunload', this.beforeUnloadHandler);
    this.dialog.closeAll(); // Also closes on route change or destroy
  }
  beforeUnloadHandler = () => {
    this.dialog.closeAll();
  };
}
