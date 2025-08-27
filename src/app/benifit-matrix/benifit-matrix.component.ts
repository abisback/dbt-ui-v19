import { Component, ViewChild } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { MatPaginator } from '@angular/material/paginator';
import { DbtdataService } from '../service/dbtdata.service';
import { MatTableDataSource } from '@angular/material/table';
import { BenMatrix } from '../model/scheme.model';

@Component({
  selector: 'app-benifit-matrix',
  imports: [SharedModule],
  templateUrl: './benifit-matrix.component.html',
  styleUrl: './benifit-matrix.component.scss'
})
export class BenifitMatrixComponent {

  //displayedColumns: string[] = ['name','lakkhirbhandar','manabik','oap','wp'];

  math = Math;

  //changes required
  displayedColumns: string[] = ['dbtid', 'name', 'lakkhirbhandar', 'manabik', 'oap', 'wp'];

  benlist: any[] = [];
  val: any;
  dataSource: any;
  public array: any;
  currentPage: number = 0;
  pageSize: number = 5;
  totalSize: number = 0;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined
  constructor(private dbtDataService: DbtdataService,) { }

  ngOnInit(): void {
    this.dbtDataService.GetBenMatrix().subscribe(x => {

      this.dataSource = new MatTableDataSource<BenMatrix>(x);
      this.dataSource.paginator = this.paginator;
      this.array = x.data;
      this.totalSize = this.array.length;
      //console.log(this.dataSource.filteredData);
      //console.log(x);
      this.iterator();
      //this.benlist = x;
      //val=this.benlist.
      //console.log(this.genderList);
    });

  }
  public handlePage(e: any) {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    this.iterator();
  }
  private iterator() {
    const end = (this.currentPage + 1) * this.pageSize;
    const start = this.currentPage * this.pageSize;
    const part = this.array.slice(start, end);
    this.dataSource = part;
  }

}
