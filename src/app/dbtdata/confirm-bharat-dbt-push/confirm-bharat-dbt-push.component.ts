import { Component, Inject } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DbtdataService } from '../../service/dbtdata.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from '../../service/notification.service';
import { DBTData } from '../../model/dbtdata.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-confirm-bharat-dbt-push',
  imports: [SharedModule],
  templateUrl: './confirm-bharat-dbt-push.component.html',
  styleUrl: './confirm-bharat-dbt-push.component.scss'
})
export class ConfirmBharatDbtPushComponent {


  processForm = new FormGroup({
    dbtId: new FormControl(''),
    comments: new FormControl('', [Validators.required])
  });
  formArray: Array<{ dbtId: number, comments: string }> = [];
  constructor(private dbtDataService: DbtdataService,
    private dialogRef: MatDialogRef<ConfirmBharatDbtPushComponent>,
    private notify: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: DBTData[],
    private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  onSubmit(event: Event) {
    console.log(event);
    

    this.notify.confirmProposal('Once you push this data, it will reflect in Bharat DBT portal!', 'Do you want to proceed?').then((res) => {
      //debugger;
      if (res) {
        event.preventDefault(); // prevent default form submission
        const targetButtonId = (event.target as HTMLElement).querySelector('button[type=submit]:focus')?.id;
        //console.log(this.processForm.value);
        if (this.processForm.valid) {
          this.data.forEach(element => {
            this.processForm.patchValue({ dbtId: element.id });
            //console.log(element);
            

            const formData = this.processForm.value;
            // Add the form values to the array
            this.formArray.push({
              dbtId: Number(formData.dbtId ?? 0),
              comments: formData.comments ?? ''
            });
            this.processForm.reset();
            

            // this.dbtDataService.PushToBharatDbt(this.processForm.value).subscribe(response => {
            //   if (response.errorMessage != null) {
            //     this.toastr.error('Data Sending Fail! The reason is' + respons e.errorMessage);
            //     //this.dialogRef.close('Data Sending Fail!');
            //   } else {
            //     this.dialogRef.close('Data Send to Bharat DBT Succesfully');
            //   }
            // });

          })
          console.log(this.formArray);
            
            this.dbtDataService.PushToBharatDbt2(this.formArray).subscribe(response => {
              if (response.errorMessage != null) {
                this.toastr.error('Data Sending Fail! The reason is' + response.errorMessage);
                //this.dialogRef.close('Data Sending Fail!');
              } else {
                this.dialogRef.close('Data Send to Bharat DBT Succesfully');
              }
            });
          // this.processForm.patchValue({ dbtId: this.data.id });
          // this.dbtDataService.PushToBharatDbt(this.processForm.value).subscribe(response => {
          //   if (response.errorMessage != null) {
          //     this.toastr.error(response.errorMessage);
          //   } else {
          //     this.dialogRef.close('Data Send to Bharat DBT Succesfully');
          //   }
          // });
        }
        if (targetButtonId === 'approveBtn') {

        }
        // else if (targetButtonId === 'rejectBtn')
        // {
        //   if (this.processForm.valid) {
        //     console.log(this.data);
        //     this.processForm.patchValue({ dbtId: this.data.id });
        //     this.dbtDataService.RejectApplication(this.processForm.value).subscribe(response => {
        //       if (response.errorMessage != null) {
        //         this.toastr.error(response.errorMessage);
        //       } else {
        //         this.dialogRef.close('Data Reject Succesfully');
        //         //this.dialogRef.close('<span style="color: red;">Data Revert Successfully</span>');

        //       }
        //     });
        //   }
        // }
      }
    });


  }
}
