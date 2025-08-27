import { Component } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CodeValues } from '../model/code-values.model';
import { Department } from '../model/department.model';
import { MasterService } from '../service/master.service';
import { DepartmentService } from '../service/department.service';
import { SchemeService } from '../service/scheme.service';
import { ToastrService } from 'ngx-toastr';
import { MasterCodeType } from '../../app_enum';

@Component({
  selector: 'app-uploaddata',
  imports: [SharedModule],
  templateUrl: './uploaddata.component.html',
  styleUrl: './uploaddata.component.scss'
})
export class UploaddataComponent {

  schemeForm = new FormGroup({
    deptCode: new FormControl(),
    schemeType: new FormControl(),
    schemeName: new FormControl('',[Validators.required]),
    schemeCode: new FormControl(),
    transferType: new FormControl(),
    fundingPattern: new FormControl(),
    dBTSchemeCode_B: new FormControl(),
    dBTSchemeCode_C: new FormControl(),
    dBTSchemeCode_E: new FormControl(),
    onBoarded: new FormControl(),
    progress: new FormControl(),
    misIntegrated: new FormControl(),
    active: new FormControl()
  })

  schemeTypeList: CodeValues[] = []; 
  departmentList: Department[] = []; 
  benefitTypeList: CodeValues[] = []; 
  decisionTypeList: CodeValues[] = [];  
  constructor(private masterService: MasterService, 
    private departmentService: DepartmentService,private schemeService: SchemeService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.masterService.getCodeValues(MasterCodeType.Scheme_Type).subscribe(x=>{
      this.schemeTypeList = x;
      // console.log(this.schemeTypeList);
    });
    this.departmentService.getDepartments().subscribe(x=>{
      this.departmentList = x;
      // console.log(this.departmentList);
    });
    this.masterService.getCodeValues(MasterCodeType.Benefit_Type).subscribe(x=>{
      this.benefitTypeList = x;
      // console.log(this.benefitTypeList);
    });
    this.masterService.getCodeValues(MasterCodeType.DecisionType).subscribe(x=>{
      this.decisionTypeList = x;
      // console.log(this.decisionTypeList);
    });
  }

}
