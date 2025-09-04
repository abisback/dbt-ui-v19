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
  displayedColumns: string[] = [
    // 'Sno',
    'departmentName',
    'beneficiaryCount',
    'action',
  ];

  currentPage: number = 0;
  pageSize: number = 5;
  totalSize: number = 0;

  clickedRows = new Set<any>();

  @ViewChild('paginator') paginator!: MatPaginator;

  constructor() {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource([
      {
        Sno: 1,
        departmentName: 'Department 1',
        beneficiaryCount: 100,
        schemes: [
          { name: 'Scheme 1', totalBeneficiary: 50, totalExpenses: 100000 },
          { name: 'Scheme 2', totalBeneficiary: 30, totalExpenses: 100000 },
          { name: 'Scheme 3', totalBeneficiary: 20, totalExpenses: 100000 },
        ],
      },
      {
        Sno: 2,
        departmentName: 'Department 2',
        beneficiaryCount: 150,
        schemes: [
          { name: 'Scheme A', totalBeneficiary: 70, totalExpenses: 100000 },
          { name: 'Scheme B', totalBeneficiary: 50, totalExpenses: 100000 },
          { name: 'Scheme C', totalBeneficiary: 30, totalExpenses: 100000 },
        ],
      },
    ]);
    // this.dataSource = new MatTableDataSource(
    //   rawData.map((item: any, idx: any) => ({
    //     ...item,
    //     sno: this.currentPage * this.pageSize + idx + 1,
    //   }))
    // );
    this.dataSource.paginator = this.paginator;
  }

  viewDetails(row: any) {
    console.log(row);
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
    // console.log('Page event:', e);
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
  }
}
