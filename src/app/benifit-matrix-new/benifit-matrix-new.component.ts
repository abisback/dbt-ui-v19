import { Component, ViewChild } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { MatPaginator } from '@angular/material/paginator';
import { DbtdataService } from '../service/dbtdata.service';
import { MatTableDataSource } from '@angular/material/table';
import { BenMatrix_New } from '../model/scheme.model';

@Component({
  selector: 'app-benifit-matrix-new',
  imports: [SharedModule],
  templateUrl: './benifit-matrix-new.component.html',
  styleUrl: './benifit-matrix-new.component.scss'
})
export class BenifitMatrixNewComponent {


  math = Math;

  //changes required
  displayedColumns: string[] = ['dbtid', 'name', 'lakkhirbhandar', 'manabik', 'oap', 'wp'];
  //displayedColumns: string[] = ['dbtid', 'name', 'lakkhirbhandar'];
  benlist: any[] = [];
  val: any;
  dataSource: any;
  public array: any;
  currentPage: number = 0;
  pageSize: number = 5;
  totalSize: number = 0;
  schemeDet: any;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined
  constructor(private dbtDataService: DbtdataService,) { }

  ngOnInit(): void {
    this.dbtDataService.GetBenMatrix_New().subscribe(x => {

      this.dataSource = new MatTableDataSource<BenMatrix_New>(x);
      this.dataSource.paginator = this.paginator;
      this.array = x.data;
      this.totalSize = this.array.length;
      // console.log(this.dataSource.filteredData);
      // console.log(x.data[0].schemedetails);
      // console.log(this.dataSource.filteredData.data[0]);
      // console.log(this.dataSource.filteredData.data[0].schemedetails);
      this.schemeDet =
        //console.log(this.schemeDet);
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
  public test(schemedt: string, statusId: number) {
    const schemesdata = JSON.parse(schemedt);
    // console.log(scheme[0]);
    var image;
    for (let index = 0; index < schemesdata.length; index++) {
      // debugger;
      //console.log(schemesdata.length,index);

      const element = schemesdata[index];
      if (schemesdata[index].scheme == statusId) {
        switch (schemesdata[index].bentype) {
          case 1:
            image = 'eligible.png';
            break;
          case 2:
            image = 'benefitted.png';
            break;
          case 3:
            image = 'benefitted_not_eligible.png';
            break;
        }

        break;
      } else {
        if (schemesdata.length - 1 == index) {
          image = 'cancel.png';
        }
      }
    }
    return image;

    // schemesdata.forEach((scheme: any ) => {
    //   console.log(scheme.scheme);

    //     if(scheme.scheme == statusId)
    //     {
    //         return 'eligible.png';
    //     }
    // });

  }

}
