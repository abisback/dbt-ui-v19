import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MasterService } from '../service/master.service';
import { MasterCodeType } from '../../app_enum';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-search-eligible-benificiary',
  imports: [SharedModule],
  templateUrl: './search-eligible-benificiary.component.html',
  styleUrl: './search-eligible-benificiary.component.scss'
})
export class SearchEligibleBenificiaryComponent {


  dbtDataForm = new FormGroup({
  })

  displayedColumns: string[] = ['schemeid','schemename','iseligible','isapplied'];
  tableflag:boolean=false;
  dataSource: any;

 
  isSchemeFound: boolean = false;
  genderList: any[] = [];
  casteList: any[]=[];
  maritalStatusList: any[]=[];
  religionList: any[]=[];


  constructor(private masterService: MasterService,) { }

  ngOnInit(): void {
    this.masterService.getCodeValues(MasterCodeType.Genders).subscribe(x=>{
      this.genderList = x;
       //console.log(this.genderList);
    });
    this.masterService.getCodeValues(MasterCodeType.Caste).subscribe(x=>{
      this.casteList = x;
       //console.log(this.casteList);
    });
    this.masterService.getCodeValues(MasterCodeType.Marital_Status).subscribe(x=>{
      this.maritalStatusList = x;
       //console.log(this.maritalStatusList);
    });

    this.masterService.getCodeValues(MasterCodeType.Religion).subscribe(x=>{
      this.religionList = x;
       //console.log(this.religionList);
    });

  }

  onSubmit(){
    //console.log(this.dbtDataForm.value);
    this.tableflag=true;
  }

}
