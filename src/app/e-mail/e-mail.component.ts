import { Component, ViewChild } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MailDialogComponent } from './mail-dialog/mail-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
interface SentMail {
  to: string;
  subject: string;
  dateSent: Date;
  status: 'Sent' | 'Failed';
}

@Component({
  selector: 'app-e-mail',
  imports: [SharedModule],
  templateUrl: './e-mail.component.html',
  styleUrl: './e-mail.component.scss',
})
export class EMailComponent {
  displayedColumns: string[] = [
    'serial',
    'to',
    'subject',
    'dateSent',
    'status',
    'actions',
  ];

  dataSource = new MatTableDataSource<SentMail>();
  currentPage: number = 0;
  pageSize: number = 10;
  totalSize: number = 0;

  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    // Sample data
    const users: SentMail[] = [
      {
        to: 'john@example.com',
        subject: 'Meeting Notes',
        dateSent: new Date(),
        status: 'Sent',
      },
      {
        to: 'jane@example.com',
        subject: 'Follow Up',
        dateSent: new Date(),
        status: 'Failed',
      },
    ];

    // Assign data to dataSource
    this.dataSource.data = users;

    // Attach sort
    this.dataSource.sort = this.sort;
  }
  openAddDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'form-dialog';
    dialogConfig.width = '40%';
    dialogConfig.minWidth = '410px';
    dialogConfig.height = '80%';
    dialogConfig.minHeight = '80%';

    // Add your data here
    dialogConfig.data = {
      title : 'New Message'
      // to: 'example@example.com',
      // cc: ['cc1@example.com', 'cc2@example.com'],
      // subject: 'Hello',
      // body: 'This is the email body',
    };

    const dialogRef = this.dialog.open(MailDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((response) => {
      if (response != true) {
        // this.toastr.success(response);
        // this.loadDataTable();
      }
    });
  }

  // View mail
  viewMail(mail: SentMail): void {
    // console.log('Viewing mail:', mail);
    // // Open a dialog or route to a detail page
    // this.dialog.open(MailDialogComponent, {
    //   width: '600px',
    //   data: mail
    // });
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'form-dialog';
    dialogConfig.width = '40%';
    dialogConfig.minWidth = '410px';
    dialogConfig.height = '80%';
    dialogConfig.minHeight = '80%';

    // Add your data here
    dialogConfig.data = {
      title : `View Message`
      // to: 'example@example.com',
      // cc: ['cc1@example.com', 'cc2@example.com'],
      // subject: 'Hello',
      // body: 'This is the email body',
    };

    const dialogRef = this.dialog.open(MailDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((response) => {
      if (response != true) {
        // this.toastr.success(response);
        // this.loadDataTable();
      }
    });
  }

  // Resend mail
  resendMail(mail: SentMail): void {
    console.log('Resending mail to:', mail.to);
    // Implement resend logic here (e.g. API call)
    // Example:
    // this.mailService.resendMail(mail).subscribe(...)
    alert(`Mail resent to ${mail.to}`);
  }

  // Delete mail
  // deleteMail(mail: SentMail): void {
  //   console.log('Deleting mail:', mail);
  //   // Confirm deletion
  //   const confirmed = confirm(
  //     `Are you sure you want to delete mail to ${mail.to}?`
  //   );
  //   if (confirmed) {
  //     this.dataSource.data = this.dataSource.data.filter((m) => m !== mail);
  //   }
  // }
  handlePage(e: any) {}
}
