import { NgModule } from '@angular/core';
// import { KeyboardShortcutsModule } from 'ng-keyboard-shortcuts';
// import { NgxSpinnerModule } from 'ngx-spinner';
// import { MaterialModule } from './material.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
// import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { ToastrModule } from 'ngx-toastr';
// import { NgxPermissionsModule } from 'ngx-permissions';
import { NgApexchartsModule } from 'ng-apexcharts';



@NgModule({
  exports: [
    CommonModule,
    // NgxSpinnerModule,
    // NgxPermissionsModule,
    // KeyboardShortcutsModule,
    MaterialModule,
    RouterModule,
    // HttpClientModule,
    // ToastrModule, // This will break in standalone apps, ToastrModule removed for Angular 19 standalone
    ReactiveFormsModule,
    NgApexchartsModule,

  ]
})
export class SharedModule { }
