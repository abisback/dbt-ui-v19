import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Scheme } from '../../../model/scheme.model';
import { CodeValues } from '../../../model/code-values.model';
import { MasterService } from '../../../service/master.service';
import { HelperService } from '../../../service/helper.service';
import { SchemeService } from '../../../service/scheme.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MasterCodeType } from '../../../../app_enum';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-add-scheme-budget',
  imports: [SharedModule],
  templateUrl: './add-scheme-budget.component.html',
  styleUrl: './add-scheme-budget.component.scss'
})
export class AddSchemeBudgetComponent {

  schemeBudgetForm = new FormGroup({
    finYr: new FormControl(),
    financialYear: new FormControl(),
    centralAllocation: new FormControl(),
    stateAllocation: new FormControl(),
    additionalAllocation: new FormControl(),
    totalAllocation: new FormControl(),
    remarks: new FormControl(),
    schemeId: new FormControl(),
    fundingPattern: new FormControl(),
    isActive: new FormControl(),
  })
  viewData:Scheme | undefined;
  financialYearList: CodeValues[] = [];
  financialYear:any;
  


  constructor(private masterService: MasterService,
    public helperService: HelperService,
    @Inject(MAT_DIALOG_DATA) public data: Scheme,
    private schemeService: SchemeService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<AddSchemeBudgetComponent>
  ) { }

  ngOnInit(): void {
    this.viewData = this.data;
    this.masterService.getCodeValues(MasterCodeType.Financial_Year).subscribe(x=>{
      //console.log(x[6]);
      this.financialYearList = x;
      this.financialYear=x[7];
    });
  }

  updateTotalAllocation(){
    let totalAlloc: number = 0;

    totalAlloc = parseInt(this.schemeBudgetForm.value.centralAllocation===null?0:this.schemeBudgetForm.value.centralAllocation)+
                parseInt(this.schemeBudgetForm.value.stateAllocation===null?0:this.schemeBudgetForm.value.stateAllocation)+
                parseInt(this.schemeBudgetForm.value.additionalAllocation===null?0:this.schemeBudgetForm.value.additionalAllocation);

    this.schemeBudgetForm.patchValue({totalAllocation: totalAlloc});
  }

  getFinYearFromId(key: any){
    let finYear: string = "";
    this.financialYearList.filter((item: CodeValues) =>{
      if(item.codeValueId.toLowerCase().includes(key.toLowerCase())){
        //console.log(item.codeValueDesc.trim());
          finYear = item.codeValueDesc.trim();
      }
    });
    return finYear;
  }

  updateFinYear(key: any){
    let financialYear: string="";
    financialYear=this.getFinYearFromId(key.value);
    this.schemeBudgetForm.patchValue({financialYear: financialYear});
  }

  onSubmit() {
    if(this.schemeBudgetForm.valid){
      this.schemeBudgetForm.patchValue({schemeId: this.viewData?.id});
      this.schemeBudgetForm.patchValue({fundingPattern: this.viewData?.fundingPattern});
      this.schemeBudgetForm.patchValue({isActive: true});
      //console.log(this.schemeBudgetForm.value);
      this.schemeService.RegisterSchemeBudget(this.schemeBudgetForm.value).subscribe(response=>{
        //alert(response.errorMessage);
        if(response.errorMessage != null){
          // alert(response.errorMessage);
          this.toastr.error(response.errorMessage);
        }else{
          this.dialogRef.close('Scheme Budget Succesfully Saved');
        }
      });
    }
  }
}
