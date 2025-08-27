import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { MontlyDBTStatus } from '../../../model/month-dbt-status.model';
import { Department } from '../../../model/department.model';
import { Scheme } from '../../../model/scheme.model';
import { Month } from '../../../model/month.model';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DbtdataService } from '../../../service/dbtdata.service';
import { DepartmentService } from '../../../service/department.service';
import { SchemeService } from '../../../service/scheme.service';
import { MonthService } from '../../../service/month.service';

@Component({
  selector: 'app-scheme-wise-monthly-status',
  imports: [SharedModule],
  templateUrl: './scheme-wise-monthly-status.component.html',
  styleUrl: './scheme-wise-monthly-status.component.scss'
})
export class SchemeWiseMonthlyStatusComponent {

  data: MontlyDBTStatus[] = [];
  departmentList: Department[] = [];
  copyDepartmentList: Department[] = [];
  schemeList: Scheme[] = [];
  copySchemeList: Scheme[] = [];
  monthlist: Month[] = [];
  public displayMonthlySchemeStatus: boolean = false;
  public selectedScheme: any;
  notify: any;
  reportForm!: FormGroup;
  deptControl = new FormControl('');
  schemeControl = new FormControl('');


  constructor(private toastr: ToastrService, private dbtDataService: DbtdataService,
    private departmentService: DepartmentService,
    private schemeService: SchemeService,
    private monthService: MonthService) { }

  ngOnInit(): void {
    let deptCode = localStorage.getItem("deptCode");
    //debugger;
    let a = this.departmentService.encryptPassword(deptCode);
    //console.log(btoa(a));
    let enccd = btoa(a);
    if (deptCode == null || deptCode == "") {
      this.departmentService.getDepartments().subscribe(x => {
        this.departmentList = this.copyDepartmentList = x;
      });
    } else {
      this.departmentService.GetDepartment(enccd).subscribe(x => {
        this.departmentList.push(x.result);
      });
      this.copyDepartmentList = [...this.departmentList];

    }

    this.monthService.getMonths().subscribe(x => {
      this.monthlist = x;
    });
  }

  departmentChange(e: any, value: any) {
    if (e.isUserInput) {





      // if (role == 'DNOD' || role == 'DOPT') {
      //   let schemeCode = localStorage.getItem("schemeCode");

      //   this.schemeService.GetSchemeByCode(schemeCode).subscribe(x => {
      //     //this.schemeList = x;
      //     console.log(x);

      //   });
      // }

      this.schemeService.findActiveSchemes(value).subscribe(x => {
        this.schemeList = this.copySchemeList = x;
      });



      //console.log(value);
    }

  }

  schemeChange(event: any) {
    if (event.isUserInput) {
      this.selectedScheme = this.schemeList.filter(s => s.id == event.source.value)[0];
      //console.log(this.selectedScheme);

      this.dbtDataService.SchemeWiseMonthlyReportingStatus(event.source.value).subscribe(x => {
        //console.log(x.result.length);
        if (x.result.length > 0) {
          //console.log(x.result);
          this.data = x.result;
          this.displayMonthlySchemeStatus = true;
        }
        else {
          this.displayMonthlySchemeStatus = false;
          this.toastr.error('Data Not Found')
        }

      });

    }

  }

  replaceAll(str: any, find: any, replace: any) {
    var escapedFind = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    return str.replace(new RegExp(escapedFind, 'g'), replace);
  }
  displayFnDepartment(deptCode: Department): string {
    const dept = this.departmentList?.find((s: any) => s.deptCode === deptCode);
    return dept ? dept.name : '';
  }

  searchdept(e: any) {
    if (e !== undefined) {
      let term = '';
      if (e.target.value.length > 0) {
        term = e.target.value;
      }
      if (term !== undefined && term !== '' && term != null) {
        if (term.length > 0) {
          const lowerTerm = String(term).toLowerCase();
          this.departmentList = this.copyDepartmentList?.filter((data: any) => {
            return String(data.name).toLowerCase().indexOf(lowerTerm) >= 0 ||
              String(data.code).toLowerCase().indexOf(lowerTerm) >= 0;
          });
        }
      } else {
        this.departmentList = this.copyDepartmentList;
      }
    }
  }

  searchScheme(e: any) {
    if (e !== undefined) {
      let term = '';
      if (e.target.value.length > 0) {
        term = e.target.value;
      }
      if (term !== undefined && term !== '' && term != null) {
        if (term.length > 0) {
          const lowerTerm = String(term).toLowerCase();
          this.schemeList = this.copySchemeList?.filter((data: any) => {
            return String(data.schemeName).toLowerCase().indexOf(lowerTerm) >= 0 ||
              String(data.id).toLowerCase().indexOf(lowerTerm) >= 0;
          });
        }
      } else {
        this.schemeList = this.copySchemeList;
      }
    }
  }

  displaySchemeFn(schemeId: number): string {
    // Find the scheme by ID
    const scheme = this.schemeList?.find((s: any) => s.id === schemeId);
    return scheme ? scheme.schemeName : '';
  }

  resetForm() {
    this.displayMonthlySchemeStatus = false;
    this.selectedScheme = null;
    this.data = [];
    this.schemeList = this.copySchemeList;
    this.departmentList = this.copyDepartmentList;
    // this.reportForm.reset();
    this.schemeControl.reset();
    this.deptControl.reset();

  }

}
