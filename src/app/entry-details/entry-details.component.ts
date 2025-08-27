import { Component } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Department } from '../model/department.model';
import { Scheme } from '../model/scheme.model';
import { DepartmentService } from '../service/department.service';
import { DbtdataService } from '../service/dbtdata.service';
import { SchemeService } from '../service/scheme.service';
import { ToastrService } from 'ngx-toastr';
import { MasterService } from '../service/master.service';
import { MasterCodeType } from '../../app_enum';

@Component({
  selector: 'app-entry-details',
  imports: [SharedModule],
  templateUrl: './entry-details.component.html',
  styleUrl: './entry-details.component.scss'
})
export class EntryDetailsComponent {

  dbtDataForm = new FormGroup({
    schemeCode: new FormControl(),
    gender:new FormControl(),
    caste:new FormControl(),
    meritalStatus:new FormControl(),
   // finYrCode:new FormControl(),
   religion:new FormControl(),
   minAge:new FormControl(),
   maxAge:new FormControl(),
   aadharExist:new FormControl(),
   resPeriodInState:new FormControl('',Validators.maxLength(10)),
   familyIncome:new FormControl('',Validators.maxLength(10)),
   swasthasathiExist:new FormControl(),
   
  })

  departmentList: Department[] = []; 
  schemeList: Scheme[] = [];
  isSchemeFound: boolean = false;
  genderList: any[] = [];
  casteList: any[]=[];
  maritalStatusList: any[]=[];
  religionList: any[]=[];

  constructor(
    private departmentService: DepartmentService,
    private dbtDataService:DbtdataService,
    private schemeService:SchemeService, 
    private toastr: ToastrService,
    private masterService: MasterService,
    // private dialogRef: MatDialogRef<EntryDetailsComponent>
  ) { }

  ngOnInit(): void {
    let deptCode = localStorage.getItem('deptCode');
    let a=this.departmentService.encryptPassword(deptCode);
    //console.log(btoa(a));
    let enccd=btoa(a);
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

    this.dbtDataService.RegisterSchemeDetails(this.dbtDataForm.value).subscribe(response=>{
      if(response.errorMessage != null){
        // alert(response.errorMessage);
        this.toastr.error(response.errorMessage);

      }else{
        //this.toastr.success('');
        //this.dialogRef.close('DBT Data Saved Successfully');
      }
    });

  }

}
