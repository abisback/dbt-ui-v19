import { Component, ViewChild } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexYAxis,
  ApexTooltip,
  ApexPlotOptions,
  ApexFill
} from 'ng-apexcharts';
import { MasterCodeType } from '../../app_enum';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../service/user.service';
import { Router } from '@angular/router';
import { NotificationService } from '../service/notification.service';
import { DashboardService } from '../service/dashboard.service';
import { MasterService } from '../service/master.service';
import { SchemeService } from '../service/scheme.service';
import { SharedModule } from '../shared/shared.module';
import * as XLSX from 'xlsx';
import { ExtendedDbtDataComponent } from './extended-dbt-data/extended-dbt-data.component';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis?: ApexYAxis;
  dataLabels?: ApexDataLabels;
  stroke?: ApexStroke;
  tooltip?: ApexTooltip;
  plotOptions?: ApexPlotOptions;
  fill?: ApexFill;
};
@Component({
  selector: 'app-dashboard',
  imports: [SharedModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {


    // dbtDataForm = new FormGroup({
  //   deptCode: new FormControl(),
  //   schemeId: new FormControl(),
  //   finYrCode: new FormControl()
  // });
  schemeControl = new FormControl('');
  dbtDataForm!: FormGroup;
  dataSource: any;
  departmentList: any[] = [];
  schemeList: any[] = [];
  schemeListName: any;
  notReportedSchemeList: any[] = [];
  allNotReportedSchemeList: any[] = [];
  CopyschemeListName: any;
  finYrList: any[] = [];
  reportingMonths: number[] = [];
  fundTransferCashs: number[] = [];
  expenditureKinds: number[] = [];
  departmentCount: any;
  totalBen: any;
  totalFundTranferCash: any;
  formattedAverageExpenditure: any;
  totalScheme: any;
  totalSchemeCount: any;
  chart: any;
  deptCode: any;
  userRole!: string;
  DeptId!: string;
  schemeID: any;
  selectedDept: number = -1;
  public chartOptions: any;
  public secondChartOptions: any;
  thirdChartOptions: any;
  latestData: any[] = [];
  showTooltip: boolean = false;
  isChartVisible: boolean = false;
  topExpenseSchemes: any[] = [];
  filterTypeOption = [
  { name: 'ALL', value: 0 },
  { name: 'Scheme Not Updated', value: 1 },
  { name: 'Push To Bharat DBT Not Updated', value: 2 },
  { name: 'Last Push To Bharat DBT', value: 3 },
  { name: 'Scheme Never Pushed', value: 4 }
];


  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(
    public dialog: MatDialog,
    private toastr: ToastrService,
    private userService: UserService,
    private route: Router,
    private notify: NotificationService,
    private dashboardService: DashboardService,
    private schemeService: SchemeService,
    private masterService: MasterService,
    private fb: FormBuilder

  ) { }

  ngOnInit(): void {
    this.GetUserRoleAndDeptId();
    this.loadDashboardData();
    this.loadDepartmentCount();
    this.loadTotalSchemes();
    // this.loadTotalBenAndAmt();
    this.loadFinancialYearList();
    this.checkUserProfile();
    this.GetSchemeNotReported(0, 0);
    this.GetFundTransferAndExpenditure(0);
    this.topExpensiveSchemes(0);

    this.dbtDataForm = this.fb.group({
      deptCode: [''],
      schemeId: [''],
      finYrCode: ['']
    });




  }

  topExpensiveSchemes(finYear: number) {
    this.dashboardService.GetTopExpensiveSchemes(finYear).subscribe((res: any) => {
      this.topExpenseSchemes = res.result;
    });
  }

  GetFundTransferAndExpenditure(schemeId: number) {
    this.dashboardService.GetFundTransferAndExpenditure(schemeId || 0).subscribe((res: any) => {
      if (res.result.length == 0) {
        this.isChartVisible = false;
        this.toastr.error("Data not found")
      }
      else {
        const data = res.result;

        // console.log(data);
        this.pieChart(data);
        this.radialChart(data);
        if (res.result.length > 0) {
          this.isChartVisible = true;
        }
      }
    });
  }
pieChart(pieData: any) {
  this.secondChartOptions = {
    series: [
      Number(Number(pieData[0]?.totalCentralShare).toFixed(2)),
      Number(Number(pieData[0]?.totalStateShare).toFixed(2))
    ],
    chart: {
      type: "pie",
      width: "100%", // ✅ Responsive width
      height: this.getPieHeight(), // ✅ Dynamically calculated height
    },
    labels: ["Central Share", "State Share"],
    legend: {
      show: false
    },
    dataLabels: {
      enabled: true
    },
    responsive: [
      {
        breakpoint: 1024, // Tablets
        options: {
          chart: {
            height: 200
          },
          dataLabels: {
            enabled: true
          }
        }
      },
      {
        breakpoint: 768, // Mobile
        options: {
          chart: {
            height: 180
          },
          dataLabels: {
            enabled: false
          }
        }
      },
      {
        breakpoint: 480, // Very small phones
        options: {
          chart: {
            height: 160
          },
          dataLabels: {
            enabled: false
          }
        }
      }
    ]
  };
}
getPieHeight(): number {
  const screenWidth = window.innerWidth;

  if (screenWidth <= 480) return 180;
  if (screenWidth <= 768) return 250;
  if (screenWidth <= 1024) return 210;
  return 220; // default for desktop
}

  radialChart(radialData: any) {
    this.thirdChartOptions = {
      series: [
        Number((Number(radialData[0]?.totalFundCashState) / 10000000).toFixed(2)),
        Number((Number(radialData[0]?.totalExpenditureKindState) / 10000000).toFixed(2)),
        Number((Number(radialData[0]?.totalFundCashCentral) / 10000000).toFixed(2)),
        Number((Number(radialData[0]?.totalExpenditureKindCentral) / 10000000).toFixed(2))
      ],
      chart: {
        height: this.getPieHeight(),
        width: "100%",
        type: "radialBar"
      },
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: {
              fontSize: "22px"
            },
            value: {
              fontSize: "13px",
              formatter: function (val: number) {
                return val + " Cr";
              }
            },
            total: {
              show: true,
              label: "Total",
              formatter: (w: any) => {
                const s = radialData[0];
                const total = (
                  Number(s?.totalFundCashState) +
                  Number(s?.totalExpenditureKindState) +
                  Number(s?.totalFundCashCentral) +
                  Number(s?.totalExpenditureKindCentral)
                ) / 10000000;
                return total.toFixed(2) + " Cr";
              }
            }
          }
        }
      },
      labels: ["State Cash", "State Kind", "Central Cash", "Central Kind"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 260
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }





  GetUserRoleAndDeptId() {
    this.userRole = localStorage.getItem('role') || '';
    this.DeptId = localStorage.getItem('deptCode') || '';
    if (this.DeptId) {
      this.deptCode = Number(this.DeptId);
      this.schemeService.findSchemes(this.deptCode).subscribe((x:any) => {
        this.schemeList = x;
        this.schemeList.unshift({ "schemeName": "All", "id": 0 });
      });
    }
  }

  loadDashboardData(): void {
    this.dashboardService.GetCashAndKindData(this.deptCode || 0, 0, 0).subscribe((res: any) => {
      if (res.result.length == 0) {
        this.toastr.error("Data not found")
      }
      else {
        if (res.apiResponseStatus == 1) {
          res.result.forEach((item: any) => {
            this.reportingMonths.push(item.reportingMonth);
            this.expenditureKinds.push(item.expenditureKind);
            this.fundTransferCashs.push(item.fundTrnsferCash);
          });
          this.initializeChart();
        } else {
          this.toastr.error(res.errorMessage);
        }
      }
    });
  }

  loadDepartmentCount(): void {
    this.dashboardService.GetAllDepartmentCount().subscribe((res: any) => {
      if (res.apiResponseStatus == 1) {
        this.departmentCount = this.formatAmount(res.result.length);
        this.departmentList = res.result;
        this.departmentList.unshift({ "name": "All", "deptCode": 0 });
      } else {
        this.toastr.error(res.errorMessage);
      }
    });
  }

  loadTotalBenAndAmt(): void {
    this.dashboardService.GetBenAndAmt().subscribe((res: any) => {
      const averageExpenditure = res.result[0]?.fundTrnsferCash / this.totalSchemeCount || 0;
      this.formattedAverageExpenditure = this.formatAmount(averageExpenditure);
      this.totalBen = this.formatAmount(res.result[0]?.totalBen || 0);
      this.totalFundTranferCash = this.formatAmount(res.result[0]?.fundTransferAndExpenditure || 0);
    });
  }

  loadTotalSchemes(): void {
    this.dashboardService.GetAllScheme().subscribe((res: any) => {
      this.schemeListName = this.CopyschemeListName = res.result;
      this.totalSchemeCount = res.result.length;
      this.totalScheme = this.formatAmount(res.result.length);
      this.loadTotalBenAndAmt();
    });
  }

  loadFinancialYearList(): void {
    this.masterService.getCodeValues(MasterCodeType.Financial_Year).subscribe((x: any) => {
      // this.finYrList = x;
       this.finYrList = x.sort((a: { codeValueDesc: string }, b: { codeValueDesc: string }) => b.codeValueDesc.localeCompare(a.codeValueDesc));
      // this.finYrList.unshift({"codeValueDesc":"All", "codeValueId":0});
    });
  }

  checkUserProfile(): void {
    const userid = localStorage.getItem('userId');
    this.userService.GetUserProfile(userid).subscribe((x: any) => {
      if (x.result['status'] === 0) {
        this.notify.notification('You have to change your password, this is mandatory!');
        this.route.navigate(['change-passwd']);
      }
    });
  }

  initializeChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const mappedMonths = this.reportingMonths.map(month => monthNames[month - 1]);




    this.chartOptions = {
      series: [
        {
          name: "FundTransferCash",
          data: [...this.fundTransferCashs]
        },
        {
          name: "ExpenditureKind",
          data: [...this.expenditureKinds]
        }
      ],
      chart: {
        type: "bar",
        height: 250,
        width: '100%',
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
          borderRadius: 5,
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        categories: [...mappedMonths]
      },
      yaxis: {
        title: {
          text: "(₹)"
        },
        labels: {
          formatter: (val: number) => this.formatAmount(val)
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: (val: number) => this.formatAmount(val)
        }
      }
    };
















    // this.chart = new Chart('canvas', {
    //   type: 'bar',
    //   data: {
    //     labels: mappedMonths,
    //     datasets: [
    //       {
    //         label: 'FundTransferCash',
    //         data: this.fundTransferCashs,
    //         borderColor: 'rgba(75, 192, 192, 1)',
    //         backgroundColor: "#4bc0c0"
    //       },
    //       {
    //         label: 'ExpenditureKind',
    //         data: this.expenditureKinds,
    //         borderColor: 'rgba(75, 192, 192, 1)',
    //         backgroundColor: "#ff6384",
    //       },
    //     ],
    //   },
    //   options: {
    //     scales: {
    //       // y: {
    //       //   beginAtZero: true,
    //       // },

    //     },
    //   },
    // });


  }

  downloadChart(): void {
    if (this.chart) {
      const link = document.createElement('a');
      link.href = this.chart.toBase64Image();
      link.download = 'chart.png';
      link.click();
    }
  }

  onDepartmentSelect(event: any, deptCode: any): void {
    this.selectedDept = deptCode
    if (deptCode == 0) {
      this.schemeID = 0;
    }
    this.dbtDataForm.get('finYrCode')?.setValue(0);
    if (event.isUserInput) {
      this.schemeService.findSchemes(deptCode).subscribe((x:any) => {
        this.schemeList = x;
        this.schemeList.unshift({ "schemeName": "All", "id": 0 });
      });
      this.LoadChartData(deptCode, this.dbtDataForm.value.schemeCode || 0, this.dbtDataForm.value.finYearId || 0)
    }
  }

  handleClick() {
    if (this.selectedDept < 0) {
      this.toastr.warning("Please Select Department first")
      return;
    }
  }

  onSchemeSelect(event: any, schemeId: number): void {
    if (event.isUserInput) {
      this.LoadChartData(0, schemeId, this.dbtDataForm.value.finYrCode || 0)
    }
  }
  onSchemeSelectForShare(event: any, schemeId: number): void {
    if (event.isUserInput) {
      this.GetFundTransferAndExpenditure(schemeId);
    }
  }



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.notReportedSchemeList = this.allNotReportedSchemeList.filter(item =>
      item.schemeName.toLowerCase().includes(filterValue) ||
      String(item.schemeCode).toLowerCase().includes(filterValue) ||
      (item.reportingMonthName + ' ' + item.financialYear).toLowerCase().includes(filterValue)
    );
  }

  onFinancialYearSelect(event: any, finYearId: any): void {
    if (event.isUserInput) {
      this.LoadChartData(this.dbtDataForm.value.deptCode || 0, this.dbtDataForm.value.schemeId || 0, finYearId)

    }
  }

  //Load Chart Data

  LoadChartData(deptCode: number, schemeCode: number, finYrCode: number) {
    this.dashboardService
      .GetCashAndKindData(
        deptCode,
        schemeCode,
        finYrCode
      )
      .subscribe((res: any) => {
        if (res.apiResponseStatus === 1) {
          if (!res.result.length) {
            this.toastr.warning("Data Not Found");
            this.resetChartData()
          } else {
            this.resetChartData();
            res.result.forEach((item: any) => {
              this.reportingMonths.push(item.reportingMonth);
              this.expenditureKinds.push(item.expenditureKind);
              this.fundTransferCashs.push(item.fundTrnsferCash);
            });
          }
          this.initializeChart();
        } else {
          this.toastr.error(res.errorMessage);
        }
      });
  }


  resetChartData(): void {
    this.fundTransferCashs = [];
    this.expenditureKinds = [];
    this.reportingMonths = [];
  }

  formatAmount(amount: number) {
    if (amount >= 10000000) {
      return (amount / 10000000).toFixed(2) + "Cr";
    } else if (amount >= 100000) {
      return (amount / 100000).toFixed(2) + "L";
    } else if (amount >= 1000) {
      return (amount / 1000).toFixed(3) + "K";
    } else {
      return amount.toString();
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
          this.schemeListName = this.CopyschemeListName?.filter((data: any) => {
            return String(data.schemeName).toLowerCase().indexOf(lowerTerm) >= 0 ||
              String(data.id).toLowerCase().indexOf(lowerTerm) >= 0;
          });
        }
      } else {
        this.schemeListName = this.CopyschemeListName;
      }
    }
  }


  // openAddDialog(): void {
  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.disableClose = true;
  //   dialogConfig.autoFocus = true;
  //   dialogConfig.panelClass = 'form-dialog';
  //   dialogConfig.width = '60%';
  //   dialogConfig.minWidth = '400px';
  //   dialogConfig.height = '100%';

  //   const dialogRef = this.dialog.open(AddDbtdataNewformatComponent, dialogConfig);
  // dialogRef.afterClosed().subscribe((response) => {
  //   if (response !== true) {
  //     this.toastr.success(response);
  //     this.loadDataTable();
  //   }
  // });
  //}

  // loadDataTable(): void {
  //   const deptCode = localStorage.getItem('deptCode');
  //   this.dbtDataService.getDBTDataByDept(deptCode).subscribe((x: DBTData[] | undefined) => {
  //     this.dataSource = new MatTableDataSource<DBTData>(x);
  //     this.dataSource.paginator = this.paginator;
  //   });
  // }


  GetSchemeNotReported(schemeId: number, filterValue: number): void {
    this.dashboardService.GetNotReportedSchemeList(schemeId || 0, filterValue).subscribe((res: any) => {
      if (res.apiResponseStatus === 1) {
        this.notReportedSchemeList = this.allNotReportedSchemeList = res.result;
        // this.CopyschemeListName = res.result;
      } else {
        this.toastr.error(res.errorMessage);
      }
    });
  }

  displaySchemeFn(schemeId: number): string {
    // Find the scheme by ID
    const scheme = this.schemeListName?.find((s: any) => s.id === schemeId);
    return scheme ? scheme.schemeName : '';
  }
  displayFinancialYearFn(finYearId: number): string {
    // Find the financial year by ID
    const finYear = this.finYrList.find((f: any) => f.codeValueId === finYearId);
    return finYear ? finYear.codeValueDesc : '';
  }
  displayFilterFn(value: any) {
    const filterData = this.filterTypeOption.find((f: any) => f.value == value);
    return filterData ? filterData.name : '';
  }

  onOptionValueSelect(e: any, value: any) {

    if (e.isUserInput) {
      this.GetSchemeNotReported(0, value)
    }

  }

  async resetForm() {
    this.dbtDataForm.reset();
    await this.resetChartData()
    this.loadDashboardData();
     this.schemeListName = this.CopyschemeListName;

  }

  resetScheme() {
    this.schemeControl.reset();
     this.GetFundTransferAndExpenditure(0);
      this.schemeListName = this.CopyschemeListName;
   }
// saveExcel() {
//   const transformedData = this.notReportedSchemeList.map((item: any, index: number) => ({
//     'SI. No.': index + 1,
//     'Scheme Name': `${item.schemeCode} ${item.schemeName}`,
//     'Data Report to State DBT': `${item.reportingMonthName} ${item.financialYear}`,
//     'Push To Bharat DBT': item.pushToBharatDBTMonthName || ''  // Fallback if null/undefined
//   }));

//   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(transformedData);
//   const wb: XLSX.WorkBook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
//   XLSX.writeFile(wb, `filtered-department-wise-mis-report-${Date.now()}.xlsx`);
// }
saveExcel() {
  const transformedData = this.notReportedSchemeList.map((item: any, index: number) => ({
    'SI. No.': index + 1,
    'Scheme Name': `${item.schemeCode} : ${item.schemeName}`,
    'Data Report to State DBT': `${item.reportingMonthName} ${item.financialYear}`,
    'Push To Bharat DBT': item.pushToBharatDBTMonthName || ''
  }));

  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(transformedData);

  // Auto-adjust column widths
  const columnWidths = Object.keys(transformedData[0]).map((key) => {
    const maxLength = Math.max(
      key.length,
      ...transformedData.map((row) => ((row as Record<string, any>)[key] ? (row as Record<string, any>)[key].toString().length : 0))
    );
    return { wch: maxLength + 2 }; // +2 for padding
  });
  ws['!cols'] = columnWidths;

  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, `filtered-department-wise-mis-report-${Date.now()}.xlsx`);
}

  openAddDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'form-dialog';
    dialogConfig.width = '60%';
    dialogConfig.minWidth = '400px';
    dialogConfig.height = '55%';


    const dialogRef = this.dialog.open(ExtendedDbtDataComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(response => {
      if (response != true) {
        this.toastr.success(response);
        // this.loadDataTable();
      }
    });
  }
}
