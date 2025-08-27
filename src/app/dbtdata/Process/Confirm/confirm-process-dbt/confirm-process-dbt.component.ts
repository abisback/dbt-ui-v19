import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DbtdataService } from '../../../../service/dbtdata.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from '../../../../service/notification.service';
import { ToastrService } from 'ngx-toastr';
import { DBTData } from '../../../../model/dbtdata.model';
import { SharedModule } from '../../../../shared/shared.module';
import { ApprovalProcess } from '../../../../model/approval-process.model';

@Component({
  selector: 'app-confirm-process-dbt',
  imports: [SharedModule],
  templateUrl: './confirm-process-dbt.component.html',
  styleUrl: './confirm-process-dbt.component.scss'
})
export class ConfirmProcessDbtComponent {

  processForm: FormGroup;
  payloadDataForApprove: any[] = [];
  selectedData: any[] = [];
  constructor(private dbtDataService: DbtdataService,
    private dialogRef: MatDialogRef<ConfirmProcessDbtComponent>,
    private notify: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: DBTData[],
    private toastr: ToastrService) {
    this.processForm = new FormGroup({
      dbtId: new FormControl(''),
      comments: new FormControl('', [Validators.required])
    })
  }

  ngOnInit(): void {
  }

  onSubmit(event: Event) {

    //   this.notify.confirmProposal('Are you sure ?', 'Do you really want to entry the Data?').then((res) => {
    //     if (res) {

    //     }
    // });

    //console.log(event);
    this.payloadDataForApprove = [];
    event.preventDefault(); // prevent default form submission
    const targetButtonId = (event.target as HTMLElement).querySelector('button[type=submit]:focus')?.id;
    //console.log(targetButtonId);
    if (targetButtonId === 'approveBtn') {
      if (this.processForm.valid) {
        //console.log(this.data);
        //this.selectedData=this.data;

        //console.log(this.selectedData);
        this.data.forEach(element => {
          this.processForm.patchValue({ dbtId: element.id });
          this.dbtDataService.ProcessApplication(this.processForm.value).subscribe(response => {
            if (response.errorMessage != null) {
              this.toastr.error(response.errorMessage);
            } else {
              this.dialogRef.close('Data Approved Succesfully');
              window.location.reload();
            }
          });
        })

        //this.clickedRowsArray.forEach((elem) => {
        //                 this.payloadDataForApprove.push(elem.allotmentId);
        //             });

        // this.processForm.patchValue({ dbtId: this.data.id });
        // this.dbtDataService.ProcessApplication(this.processForm.value).subscribe(response => {
        //   if (response.errorMessage != null) {
        //     this.toastr.error(response.errorMessage);
        //   } else {
        //     this.dialogRef.close('Data Approved Succesfully');
        //   }
        // });
      }
    }
    else if (targetButtonId === 'rejectBtn') {
      if (this.processForm.valid) {
        //console.log(this.data);

        this.data.forEach(element => {
          this.processForm.patchValue({ dbtId: element.id });
          this.dbtDataService.RejectApplication(this.processForm.value).subscribe(response => {
            if (response.errorMessage != null) {
              this.toastr.error(response.errorMessage);
            } else {
              this.dialogRef.close('Data Reject Succesfully');
              //this.dialogRef.close('<span style="color: red;">Data Revert Successfully</span>');

            }
          });
        })
        // this.processForm.patchValue({ dbtId: this.data.id });
        // this.dbtDataService.RejectApplication(this.processForm.value).subscribe(response => {
        //   if (response.errorMessage != null) {
        //     this.toastr.error(response.errorMessage);
        //   } else {
        //     this.dialogRef.close('Data Reject Succesfully');
        //     //this.dialogRef.close('<span style="color: red;">Data Revert Successfully</span>');

        //   }
        // });
      }
    }

  }
}
