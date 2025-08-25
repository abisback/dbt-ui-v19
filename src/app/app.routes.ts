import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { USERROLE } from 'src/app_enum';
import { AuthGuard } from './auth/auth.guard';
import { ChangePasswdComponent } from './auth/change-passwd/change-passwd.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { BenifitMatrixNewComponent } from './benifit-matrix-new/benifit-matrix-new.component';
import { BenifitMatrixComponent } from './benifit-matrix/benifit-matrix.component';
import { ContactusComponent } from './contactus/contactus.component';
import { DashboardComponent } from './dashboard/dashboard.component';
// import { DbtdataComponent } from './dbtdata/dbtdata.component';
import { AddIncrementalDbtComponent } from './dbtdata/IncrementalDBT/add-incremental-dbt/add-incremental-dbt.component';
import { ProcessDbtComponent } from './dbtdata/Process/process-dbt/process-dbt.component';
import { SchemeWiseMonthlyStatusComponent } from './dbtdata/Report/scheme-wise-monthly-status/scheme-wise-monthly-status.component';
import { DepartmentWiseMisReportComponent } from './department-wise-mis-report/department-wise-mis-report.component';
import { DepartmentComponent } from './department/department.component';
import { EditDbtComponent } from './edit-dbt/edit-dbt.component';
import { EntryDetailsViweComponent } from './entry-details-viwe/entry-details-viwe.component';
import { EntryDetailsComponent } from './entry-details/entry-details.component';
import { PagenotfoundComponent } from './error/pagenotfound/pagenotfound.component';
import { HomeComponent } from './home/home.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { MisSchemeMonthDbtComponent } from './mis-scheme-month-dbt/mis-scheme-month-dbt.component';
import { MisSchemeWiseBeneficiaryComponent } from './mis-scheme-wise-beneficiary/mis-scheme-wise-beneficiary.component';
import { SchemeBudgetComponent } from './scheme-budget/scheme-budget.component';
import { SchemeComponent } from './scheme/scheme.component';
import { SearchBeneficiaryComponent } from './search-beneficiary/search-beneficiary.component';
import { SearchEligibleBenificiaryComponent } from './search-eligible-benificiary/search-eligible-benificiary.component';
import { UploaddataComponent } from './uploaddata/uploaddata.component';
import { UserComponent } from './user/user.component';
import { ViewCommentsComponent } from './view-comments/view-comments.component';
import { EditUserComponent } from './user/Edit User/edit-user/edit-user.component';
import { EditSchemeComponent } from './scheme/Edit/edit-scheme/edit-scheme.component';
import { ShowPasswordComponent } from './show-password/show-password.component';
// import { PushBharatDBTComponent } from './dbtdata/push-bharat-dbt/push-bharat-dbt.component';
import { ApproveSchemeComponent } from './scheme/approve-scheme/approve-scheme.component';
import { AddDraftSchemeComponent } from './scheme/add-draft-scheme/add-draft-scheme.component';
import { ReportOfPushDataComponent } from './Reports/report-of-push-data/report-of-push-data.component';
// import { AddDbtdataNewformatComponent } from './dbtdata/add-dbtdata-newformat/add-dbtdata-newformat.component';
import { AddDbtdataNewversionComponent } from './dbtdata/add-dbtdata-newversion/add-dbtdata-newversion.component';
import { PushBharatDbtComponent } from './dbtdata/push-bharat-dbt/push-bharat-dbt.component';
import { DbtdataComponent } from './dbtdata/dbtdata/dbtdata.component';
import { USERROLE } from '../app_enum';

export const routes: Routes = [{
  path:'',
  component:PublicLayoutComponent,
  children: [
    // { path:'', component:HomeComponent},
    { path: '', redirectTo: 'signin', pathMatch: 'full' },
    { path:'signin', component:SignInComponent},
    { path:'contacts', component:ContactusComponent }
  ]
},{
  path:'',
  component:AuthLayoutComponent,
  children: [
    { path:'', component:DashboardComponent },
    { path:'dashboard', component:DashboardComponent },
    { path:'contactus', component:ContactusComponent },
    { path: 'users', component:UserComponent, data:{roles: [USERROLE['Department Admin'], USERROLE['State Level Admin'], USERROLE['Super Admin'], USERROLE['Department Nodal']]}},
    { path: 'change-passwd', component:ChangePasswdComponent},
    { path: 'department',component:DepartmentComponent, data:{roles: [USERROLE['State Level Admin'], USERROLE['Super Admin']]}},
    { path: 'scheme', component:SchemeComponent, data:{roles: [USERROLE['Department Admin'], USERROLE['State Level Admin'], USERROLE['Super Admin']]}},
    // { path: 'scheme/add', component:AddSchemeComponent},
    { path: 'scheme-budget',component:SchemeBudgetComponent, data:{roles: [USERROLE['Department Admin']]}},
    { path: 'uploaddata', component:UploaddataComponent, data:{roles: [USERROLE['Department Admin'], USERROLE['Department Operator']]}},
    { path: 'dbtdata', component:DbtdataComponent, data:{roles: [USERROLE['Department Admin'], USERROLE['State Level Admin'], USERROLE['Department Operator'],USERROLE['Super Admin'],USERROLE['Department Nodal']]}},
    { path: 'processdata', component:ProcessDbtComponent, data:{roles: [USERROLE['Department Admin'], USERROLE['State Level Admin'], USERROLE['Department Nodal']]}},
    { path: 'monthlystatus', component:SchemeWiseMonthlyStatusComponent},
    { path: 'add-incremental-dbt', component:AddIncrementalDbtComponent, data:{roles: [USERROLE['Department Admin'], USERROLE['State Level Admin'], USERROLE['Department Nodal']]}},
    { path: 'entry-details', component:EntryDetailsComponent, data:{roles: [USERROLE['Department Admin'], USERROLE['State Level Admin'], USERROLE['Department Nodal']]}},
    { path: 'entry-details-viwe', component:EntryDetailsViweComponent, data:{roles: [USERROLE['Department Admin'], USERROLE['State Level Admin'], USERROLE['Department Nodal']]}},
    { path: 'search-beneficiary', component:SearchBeneficiaryComponent, data:{roles: [USERROLE['Department Admin'], USERROLE['State Level Admin'], USERROLE['Department Nodal']]}},
    { path: 'search-eligible-benificiary', component:SearchEligibleBenificiaryComponent, data:{roles: [USERROLE['Department Admin'], USERROLE['State Level Admin'], USERROLE['Department Nodal']]}},
    { path: 'benifit-matrix', component:BenifitMatrixComponent, data:{roles: [ USERROLE['State Level Admin']]}},
    { path: 'mis-scheme-month-dbt', component:MisSchemeMonthDbtComponent, data:{roles: [USERROLE['Department Admin'], USERROLE['State Level Admin'], USERROLE['Department Nodal']]}},
    { path: 'mis-scheme-wise-beneficiary', component:MisSchemeWiseBeneficiaryComponent, data:{roles: [USERROLE['Department Admin'], USERROLE['State Level Admin'], USERROLE['Department Nodal']]}},
    { path: 'benifit-matrix-new', component:BenifitMatrixNewComponent, data:{roles: [USERROLE['Department Admin'], USERROLE['State Level Admin'], USERROLE['Department Nodal']]}},
    { path: 'edit-dbt', component:EditDbtComponent, data:{roles: [USERROLE['Department Admin'], USERROLE['State Level Admin'], USERROLE['Department Nodal'],USERROLE['Department Operator']]}},
    { path: 'view-comments', component:ViewCommentsComponent, data:{roles: [USERROLE['Department Admin'], USERROLE['State Level Admin'], USERROLE['Department Nodal'],USERROLE['Department Operator']]}},
    { path: 'department-wise-mis-report', component: DepartmentWiseMisReportComponent, data: { roles: [ USERROLE['State Level Admin']] } },
    { path: 'edit-user', component: EditUserComponent, data: { roles: [USERROLE['Department Admin'], USERROLE['State Level Admin'], USERROLE['Department Nodal']] } },
    { path: 'edit-scheme', component: EditSchemeComponent, data: { roles: [USERROLE['Department Admin'], USERROLE['State Level Admin'], USERROLE['Department Nodal']] } },
    { path: 'show-password', component: ShowPasswordComponent, data: { roles: [USERROLE['Department Admin'], USERROLE['State Level Admin'], USERROLE['Department Nodal']] } },
    { path: 'push-dbt', component: PushBharatDbtComponent, data: { roles: [USERROLE['Department Admin'], USERROLE['State Level Admin'], USERROLE['Department Nodal']] } },
    // { path: 'add-dbtdata-newformat', component:AddDbtdataNewformatComponent, data:{roles: [USERROLE['Department Admin'], USERROLE['State Level Admin'], USERROLE['Department Nodal'],USERROLE['Department Operator']]}},
    { path: 'add-dbtdata-newformat', component:AddDbtdataNewversionComponent, data:{roles: [USERROLE['Department Admin'], USERROLE['State Level Admin'], USERROLE['Department Nodal'],USERROLE['Department Operator']]}},
    { path: 'approve-scheme', component:ApproveSchemeComponent, data:{roles: [ USERROLE['State Level Admin']]}},
    { path: 'add-draft-scheme', component:AddDraftSchemeComponent, data:{roles: [USERROLE['Department Admin'], USERROLE['State Level Admin'], USERROLE['Department Nodal'],USERROLE['Department Operator']]}},
    { path: 'report-of-push-data', component:ReportOfPushDataComponent, data:{roles: [ USERROLE['State Level Admin']]}},










  ], canActivate:[AuthGuard]
},
{ path: '**', pathMatch:'full', component:PagenotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: [

  ]
})
export class AppRoutingModule { }
