import { Component, ViewChild } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MailDialogComponent } from './mail-dialog/mail-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
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
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

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
    this.dataSource = new MatTableDataSource(users);
    this.dataSource.paginator = this.paginator;

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
      title: 'New Message',
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
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'form-dialog';
    dialogConfig.width = '40%';
    dialogConfig.minWidth = '410px';
    dialogConfig.height = '80%';
    dialogConfig.minHeight = '80%';
    const sentEmailData = {
      to: 'xyz.nic@gmail.com',
      cc: 'abc.nic@gmail.com',
      bcc:'zzz.nic@gmail.com',
      subject: 'Meeting Notes',
      body: `Madam/Sir,

This is a gentle reminder that the requisite information relating to the DBT Schemes being implemented by your esteemed Department has not yet been updated on the WBDBT Portal for the month of ______, ______.

You are kindly requested to update the same at the earliest to ensure timely compliance to Bharat DBT Portal.

With regards,
WBDBT Team

Finance Department`,
      status: mail.status,
      dateSent: new Date(),
    };

    // Add your data here
    dialogConfig.data = {
      title: `View Message`,
      mailData: sentEmailData,
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
