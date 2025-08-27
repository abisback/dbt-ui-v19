import { Component, ViewChild } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { MatPaginator } from '@angular/material/paginator';
import { MasterService } from '../service/master.service';
import { DbtdataService } from '../service/dbtdata.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { SchemeView } from '../model/scheme.model';
import { EntryDetailsComponent } from '../entry-details/entry-details.component';

@Component({
  selector: 'app-entry-details-viwe',
  imports: [SharedModule],
  templateUrl: './entry-details-viwe.component.html',
  styleUrl: './entry-details-viwe.component.scss'
})
export class EntryDetailsViweComponent {

  displayedColumns: string[] = ['schemeid','schemename','gender','caste','min_age','max_age','religion','has_aadhar','has_swasthasathi'];
  dataSource: any;
  elementlist:any;
  public array: any;
  currentPage :number = 0;
  pageSize:number = 5;
  totalSize:number = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined


  constructor(
    private masterService: MasterService,
    private dbtDataService:DbtdataService,
    public dialog: MatDialog,
    private toastr: ToastrService,) { }


  ngOnInit(): void {
    // this.masterService.getCodeValues(MasterCodeType.DecisionType).subscribe(x=>{
    //   this.decisionTypeList = x;
    // });
    // this.loadDataTable(-1);
    // this.dbtDataService.ViewSchemeInformation().subscribe(x=>{
    //   this.elementlist=x.data;
      
    //   console.log(this.elementlist);
      

    // });
    this.loadDataTable();
    
  }
  loadDataTable(){
    //debugger;
    this.dbtDataService.ViewSchemeInformation().subscribe(x=>{
      this.dataSource = new MatTableDataSource<SchemeView>(x.data);
      this.dataSource.paginator = this.paginator;
      this.array = x.data;
      this.totalSize = this.array.length;
    // console.log(this.dataSource.filteredData);
      //this.iterator();      
    });

    // this.schemeService.findSchemes(deptCode).subscribe(x =>{
    //   //console.log(x);
    //   this.dataSource = new MatTableDataSource<SchemeView>(x);
    //   this.dataSource.paginator = this.paginator;
    //   this.array = x;
    //   this.totalSize = this.array.length;
    // //  console.log(this.dataSource);
    //   this.iterator();
    // });
  }
  private iterator() {
    const end = (this.currentPage + 1) * this.pageSize;
    const start = this.currentPage * this.pageSize;
    const part = this.array.slice(start, end);
    this.dataSource = part;
  }

  openAddDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'form-dialog';
    dialogConfig.width = '60%';
    dialogConfig.minWidth = '400px';
    dialogConfig.height = '100%';

    const dialogRef = this.dialog.open(EntryDetailsComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(response=>{
      if(response != true){
        this.toastr.success(response);
        this.loadDataTable();
      }
    });
  }

}
