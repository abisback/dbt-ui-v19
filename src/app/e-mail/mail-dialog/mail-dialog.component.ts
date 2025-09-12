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
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
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

  // Flags to toggle CC/BCC fields
  showCC: boolean = false;
  showBCC: boolean = false;
  title: string = '';
  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toaster: ToastrService,
    private mailService: EmailService,
    
  ) {
    // console.log('this.data :>> ', this.data);
    this.title = this.data.title;
    this.composeForm = this.fb.group({
      to: ['', [Validators.required, Validators.email]],
      cc: ['', [Validators.required, Validators.email]],
      bcc: ['', [Validators.required, Validators.email]],
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
    this.mailService.getMailList().subscribe(
      (data: any) => {
        if (data.apiResponseStatus === 1) {
          this.mailList = data.result.map((x: any) => x.usersMail);
          this.toEmails.set(this.mailList);
          // console.log('Mail users:', this.mailList);
        } else {
          this.toaster.error(data.errorMessage);
        }
      },
      (error) => {
        console.error('Error fetching mail users:', error);
        debugger;
      }
    );
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.composeForm.patchValue({ attachments: Array.from(input.files) });
    }
  }

  discardEmail() {
    this.composeForm.reset();
  }

  // Sending email
  sendEmail() {
    const subject = this.composeForm.get('subject')?.value;
    const body = this.composeForm.get('body')?.value;
    const emailData = {
      to: this.toEmails,
      cc: this.ccEmails,
      bcc: this.bccEmails,
      body: body,
      subject: subject,
      // add subject, body, etc.
    };
    if (!this.toEmails || this.toEmails.length === 0) {
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

    console.log('Sending email...', emailData);
    debugger;
    // Send logic
  }

  addEmail(field: 'to' | 'cc' | 'bcc', event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add only if valid email
    if (value && this.validateEmail(value)) {
      this.getEmailSignal(field).update((emails) => [...emails, value]);
    }

    // Clear input field
    event.chipInput!.clear();
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
