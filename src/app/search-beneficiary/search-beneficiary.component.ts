import { Component, ViewChild } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { DbtdataService } from '../service/dbtdata.service';
import { ToastrService } from 'ngx-toastr';
import { BenDetails } from '../model/scheme.model';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-search-beneficiary',
  imports: [SharedModule],
  templateUrl: './search-beneficiary.component.html',
  styleUrl: './search-beneficiary.component.scss'
})
export class SearchBeneficiaryComponent {

  dbtDataForm = new FormGroup({
    selected: new FormControl(),
    mobNo:new FormControl(),
    bankIfsc:new FormControl(''),
  })
  displayedColumns: string[] = ['schemeid','schemename','iseligible','isapplied'];
  selected = '0';
  flagMob:boolean=false;
  lblflafg:boolean=false;
  flagIfsc:boolean=false;
  lblflafgaadhar:boolean=false;
  lblflafgBank:boolean=false;
  lblflafgMob:boolean=false;
  tableflag:boolean=false;
  dataSource: any;
  public array: any;
  currentPage :number = 0;
  pageSize:number = 5;
  totalSize:number = 0;


  @ViewChild(MatPaginator) paginator: MatPaginator | undefined
  constructor(
    private dbtDataService:DbtdataService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
   

  }
  onSelectionChange(event:any)
  {
    this.tableflag=false;
    if(this.selected=="1")
    {
      this.flagMob=true;
      this.lblflafgMob=true;

      this.lblflafg=false;
      this.flagIfsc=false;
      this.lblflafgaadhar=false;
      this.lblflafgBank=false;
    }
    if(this.selected=="2")
    {
      this.flagMob=true;
      this.lblflafgaadhar=true;

      this.lblflafgMob=false;

      this.lblflafg=false;
      this.flagIfsc=false;
      
      this.lblflafgBank=false;
    }
    if(this.selected=="3")
    {
      this.flagMob=true;
      this.lblflafgBank=true;
      this.flagIfsc=true;
      this.lblflafg=false;
      this.lblflafgMob=false;
      this.lblflafgaadhar=false;

    }
  }

  onSubmit()
  {
    this.dbtDataForm.patchValue({
      selected:this.selected
    });
    //console.log(this.dbtDataForm.value);
    this.dbtDataService.GetBendDetails(this.dbtDataForm.value).subscribe(x=>{
      this.dataSource = new MatTableDataSource<BenDetails>(x);
      this.dataSource.paginator = this.paginator;
      this.array = x.data;
      this.totalSize = this.array.length;
     //console.log(this.dataSource.filteredData);
      this.iterator();
    });
    this.tableflag=true;
  }
  private iterator() {
    const end = (this.currentPage + 1) * this.pageSize;
    const start = this.currentPage * this.pageSize;
    const part = this.array.slice(start, end);
    this.dataSource = part;
  }

}
