import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Inject,
  inject,
  signal,
} from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { EmailService } from '../../service/email.service';

@Component({
  selector: 'app-mail-dialog',
  imports: [SharedModule],
  templateUrl: './mail-dialog.component.html',
  styleUrl: './mail-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailDialogComponent {
  composeForm: FormGroup;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  readonly addOnBlur = true;
  readonly announcer = inject(LiveAnnouncer);

  // Signal-based arrays (Angular 17+)
  toEmails = signal<string[]>([]);
  ccEmails = signal<string[]>([]);
  bccEmails = signal<string[]>([]);

  mailList: any[] = [];
  mailData: any ={};
  isDisabled: boolean = false;

  // Flags to toggle CC/BCC fields
  showCC: boolean = false;
  showBCC: boolean = false;
  title: string = '';
  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toaster: ToastrService,
    private mailService: EmailService,
    public dialogRef: MatDialogRef<MailDialogComponent>
  ) {
    // console.log('this.data :>> ', this.data);
    this.title = this.data.title;
    this.mailData = this.data.mailData
    this.composeForm = this.fb.group({
      subject: [
        'Reminder for Updating DBT Schemes Information on WBDBT Portal',
        Validators.required,
      ],
      body: [
        `Madam/Sir,

This is a gentle reminder that the requisite information relating to the DBT Schemes being implemented by your esteemed Department has not yet been updated on the WBDBT Portal for the month of ______, ______.

You are kindly requested to update the same at the earliest to ensure timely compliance to Bharat DBT Portal.

With regards,
WBDBT Team

Finance Department`,
      ],
      attachments: [{ value: [], disabled: true }],
    });
  }
  ngOnInit(): void {
    if (this.title === 'New Message') {
      this.mailService.getMailList().subscribe(
        (data: any) => {
          if (data.apiResponseStatus === 1) {
            this.mailList = data.result
              .map((x: any) => x.usersMail)
              .filter((mail: any) => mail); // remove falsy values
            const uniqueEmails = [...new Set(this.mailList)];
            this.toEmails.set(uniqueEmails);
            // console.log('Mail users:', this.mailList);
          } else {
            this.toaster.error(data.errorMessage);
          }
        },
        (error) => {
          console.error('Error fetching mail users:', error);
        }
      );
    } else {
      this.composeForm.get('subject')?.disable();
      this.composeForm.get('body')?.disable();
      this.isDisabled = true;
    }
  }
  // onFileSelected(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files?.length) {
  //     this.composeForm.patchValue({ attachments: Array.from(input.files) });
  //   }
  // }

  // discardEmail() {
  //   this.composeForm.reset();
  //   this.ccEmails.set([]);
  //   this.bccEmails.set([]);
  //   this.toEmails.set([]);
  //   // this.dialogRef.close(); // Close without response
  // }

  // Sending email
  sendEmail() {
    if (this.title === 'View Message') {
      this.toaster.error('You are in View Mode!');
      return;
    }
    const toEmailsValue = this.toEmails();
    const ccEmailsValue = this.ccEmails();
    const bccEmailsValue = this.bccEmails();
    const subject = this.composeForm.get('subject')?.value;
    const body = this.composeForm.get('body')?.value;
    const emailData = {
      to: toEmailsValue,
      cc: ccEmailsValue,
      bcc: bccEmailsValue,
      body: body,
      subject: subject,
    };

    if (!toEmailsValue || toEmailsValue.length === 0) {
      this.toaster.error('To email is required');
      return; // stop further checks
    }

    if (!subject?.trim()) {
      this.toaster.error('Subject is required');
      return;
    }

    if (!body?.trim()) {
      this.toaster.error('Body is required');
      return;
    }

    // console.log('Sending email...', emailData);
    // debugger;
    this.mailService.sendMail(emailData).subscribe(
      (data: any) => {
        if (data.success === true) {
          this.toaster.success(data.message);
        } else {
          this.toaster.error(data.message);
        }
        this.dialogRef.close(); // ✅ Close after response
      },
      (error) => {
        console.error('Error fetching mail users:', error);
        this.toaster.error('An error occurred while sending the mail.');
        this.dialogRef.close(); // ✅ Close even on error
      }
    );
  }

  addEmail(field: 'to' | 'cc' | 'bcc', event: MatChipInputEvent): void {
    const input = (event.value || '').trim().toLowerCase();

    if (!input) {
      event.chipInput?.clear();
      return;
    }

    // Split input by comma or semicolon
    const values = input
      .split(/[,;]+/)
      .map((email) => email.trim())
      .filter((e) => e);

    const emailSignal = this.getEmailSignal(field);
    const existingEmails = emailSignal();
    let newEmails = [...existingEmails];

    const duplicates: string[] = [];
    const invalids: string[] = [];

    for (const email of values) {
      if (!this.validateEmail(email)) {
        invalids.push(email);
      } else if (newEmails.includes(email)) {
        duplicates.push(email);
      } else {
        newEmails.push(email);
      }
    }

    // Update signal if any new emails were added
    if (newEmails.length !== existingEmails.length) {
      emailSignal.set(newEmails);
    }

    // Show toaster for duplicates
    if (duplicates.length > 0) {
      this.toaster.warning(
        `Duplicate email(s) ignored: ${duplicates.join(', ')}`
      );
    }

    // Show toaster for invalid emails
    if (invalids.length > 0) {
      this.toaster.error(`Invalid email(s): ${invalids.join(', ')}`);
    }

    // Clear input field
    event.chipInput?.clear();
  }

  removeEmail(field: 'to' | 'cc' | 'bcc', email: string): void {
    this.getEmailSignal(field).update((emails) => {
      const index = emails.indexOf(email);
      if (index < 0) {
        return emails;
      }

      const updated = [...emails];
      updated.splice(index, 1);

      this.announcer.announce(`Removed ${email}`);
      return updated;
    });
  }

  editEmail(
    field: 'to' | 'cc' | 'bcc',
    oldEmail: string,
    event: MatChipEditedEvent
  ): void {
    const value = event.value.trim();

    // Remove email if empty
    if (!value) {
      this.removeEmail(field, oldEmail);
      return;
    }

    // Replace old email with new one (if valid)
    if (!this.validateEmail(value)) return;

    this.getEmailSignal(field).update((emails) => {
      const index = emails.indexOf(oldEmail);
      if (index >= 0) {
        const updated = [...emails];
        updated[index] = value;
        return updated;
      }
      return emails;
    });
  }

  private getEmailSignal(field: 'to' | 'cc' | 'bcc') {
    if (field === 'to') return this.toEmails;
    if (field === 'cc') return this.ccEmails;
    return this.bccEmails;
  }

  private validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // console.log('Key pressed:', event.key); // ✅ This must appear in console

    const target = event.target as HTMLElement;

    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable
    ) {
      return;
    }

    if (event.ctrlKey && event.shiftKey) {
      switch (event.key.toLowerCase()) {
        case 'c':
          this.onCtrlShiftC();
          event.preventDefault();
          break;

        case 'b':
          this.onCtrlShiftB();
          event.preventDefault();
          break;
      }
    }
  }

  onCtrlShiftC() {
    console.log('Ctrl + Shift + C pressed');
    this.showCC = !this.showCC;
  }

  onCtrlShiftB() {
    console.log('Ctrl + Shift + B pressed');
    this.showBCC = !this.showBCC;
  }
}
