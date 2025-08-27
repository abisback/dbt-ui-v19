import { Component, Inject } from '@angular/core';
import { SchemeBudget } from '../../../model/scheme-budget.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HelperService } from '../../../service/helper.service';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-scheme-budget-detail',
  imports: [SharedModule],
  templateUrl: './scheme-budget-detail.component.html',
  styleUrl: './scheme-budget-detail.component.scss'
})
export class SchemeBudgetDetailComponent {

  viewData:SchemeBudget | undefined;

  constructor(public dialogRef: MatDialogRef<SchemeBudgetDetailComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: SchemeBudget,
    public helperService: HelperService) { }

  ngOnInit(): void {
    this.viewData = this.data;
    //console.log(this.viewData);
  }
}
