import { Component, ViewChild } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { FormControl, FormGroup } from '@angular/forms';
import { misMonthWiseBenDtls, Scheme } from '../model/scheme.model';
import { MatPaginator } from '@angular/material/paginator';
import { SchemeService } from '../service/scheme.service';
import { ToastrService } from 'ngx-toastr';
import { DbtdataService } from '../service/dbtdata.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-mis-scheme-wise-beneficiary',
  imports: [SharedModule],
  templateUrl: './mis-scheme-wise-beneficiary.component.html',
  styleUrl: './mis-scheme-wise-beneficiary.component.scss'
})
export class MisSchemeWiseBeneficiaryComponent {

  dbtDataForm = new FormGroup({
    schemeCode: new FormControl(),
  })
  displayedColumns: string[] = ['dbtid','benid','name','age','is_aadhar_validated','aadharvalidatedate'];

  dataSource: any;
  schemeCode:any;
  currentPage :number = 0;
  pageSize:number = 5;
  totalSize:number = 0;
  schemeList: Scheme[] = [];
  isSchemeFound: boolean = false;  
  tableflag:boolean=false;
  public array: any;

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined
  constructor(
    private schemeService: SchemeService,
    private toastr: ToastrService,
    private dbtDataService:DbtdataService) { }

  ngOnInit(): void {
    let deptCode = localStorage.getItem('deptCode');
    this.schemeService.findActiveSchemes(Number(deptCode)).subscribe(x=>{
      this.schemeList = x;  
      //console.log(this.schemeList);   
      if(this.schemeList.length>0){
        this.isSchemeFound = true;
      }else{
        this.isSchemeFound = false;
        this.toastr.warning("No Scheme Mapped with this department");
      }
    });
  }

  onSubmit()
  {
    //debugger;
    // this.dbtDataForm.patchValue({
    //   schemeCode:this.schemeCode
    // });
    //console.log(this.dbtDataForm.value['schemeCode']);
    this.dbtDataService.GetMisSchemeNameWisedtls(this.dbtDataForm.value['schemeCode']).subscribe(x=>{
      if(x.data)
      {
        this.dataSource = new MatTableDataSource<misMonthWiseBenDtls>(x.data);
      this.dataSource.paginator = this.paginator;
      this.array = x.data;
      this.totalSize = this.array.length;
     //console.log(this.dataSource.filteredData);
      this.iterator();
      this.tableflag=true;
      }
      else
      {
        this.tableflag=false;
        this.toastr.error('Data not Found');
      }
      
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
