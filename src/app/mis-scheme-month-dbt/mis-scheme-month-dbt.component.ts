import { Component, ElementRef, ViewChild } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { FormControl, FormGroup } from '@angular/forms';
import { misMonthWiseReportDtls, Scheme } from '../model/scheme.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SchemeService } from '../service/scheme.service';
import { ToastrService } from 'ngx-toastr';
import { DbtdataService } from '../service/dbtdata.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-mis-scheme-month-dbt',
  imports: [SharedModule],
  templateUrl: './mis-scheme-month-dbt.component.html',
  styleUrl: './mis-scheme-month-dbt.component.scss'
})
export class MisSchemeMonthDbtComponent {

  dbtDataForm = new FormGroup({
    schemeCode: new FormControl(),
  })
  @ViewChild('TABLE')
  table!: ElementRef;
  ELEMENT_DATA: any[] = [];
  displayedColumns: string[] = ['SerialNo', 'MonthName', 'no_of_state_central', 'no_of_state', 'TotalBen', 'TotalBenDigitized', 'BenAadharSeeded', 'MobileCaptured', 'central_share', 'state_share', 'add_state_contribution', 'FundTrnsferCash', 'state_contribution_for_additional', 'grand_total', 'NoTrnsCashElectronic', 'AmntTrnsCashElectronic', 'NoTrnsCashOther', 'AmntTrnsCashOther'];
  dataSource: MatTableDataSource<misMonthWiseReportDtls> = new MatTableDataSource<misMonthWiseReportDtls>([]);
  schemeCode: any;
  currentPage: number = 0;
  pageSize: number = 5;
  totalSize: number = 0;
  schemeList: Scheme[] = [];
  CopyschemeList: Scheme[] = [];
  isSchemeFound: boolean = false;
  tableflag: boolean = false;
  public array: any;
  getSchemeCode: any;
  getSchemeCodeList: any;
  filteredScheme: any[] = [];
  storedSchemeCodesArray: any[] = [];




  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private schemeService: SchemeService, private toastr: ToastrService, private dbtDataService: DbtdataService) { }

  ngOnInit(): void {
    let deptCode = localStorage.getItem('deptCode');
    this.getSchemeCode = localStorage.getItem('schemeCode')
    this.getSchemeCodeList = JSON.parse(localStorage.getItem('schemeCodeList') || '{}');



    // this.schemeService.findActiveSchemes(Number(deptCode)).subscribe(x=>{
    //   this.schemeList = x;
    //   if(this.schemeCode){
    //     this.filteredScheme = this.schemeList.filter(scheme => this.getSchemeCode.includes(scheme.schemeCode));
    //   }
    //   else{
    //     this.filteredScheme = this.schemeList.filter(scheme => this.getSchemeCodeList.includes(scheme.schemeCode));
    //     console.log(this.filteredScheme);

    //   }
    //   if(this.filteredScheme.length>0){
    //     this.isSchemeFound = true;
    //   }else{
    //     this.isSchemeFound = false;
    //     this.toastr.warning("No Scheme Mapped with this department");
    //   }
    // });

    this.schemeService.findActiveSchemes(Number(deptCode)).subscribe(
      x => {
        this.schemeList = x;
        if (this.getSchemeCode != "" && this.getSchemeCode != null) {
          this.filteredScheme = this.CopyschemeList = this.schemeList.filter(scheme => scheme.schemeCode === this.getSchemeCode);
        }
        else if (this.getSchemeCodeList && Object.keys(this.getSchemeCodeList).length > 0) {
          for (let i in this.getSchemeCodeList) {
            this.storedSchemeCodesArray.push(`${this.getSchemeCodeList[i]}`);
          };
          this.filteredScheme = this.CopyschemeList = this.schemeList.filter(scheme => this.storedSchemeCodesArray.includes(scheme.schemeCode));
          console.log(this.filteredScheme);
        }
        else {
          this.filteredScheme = this.CopyschemeList = this.schemeList
        }

        // Update flag based on filtered schemes
        if (this.filteredScheme.length > 0) {
          this.isSchemeFound = true;
        } else {
          this.isSchemeFound = false;
          this.toastr.warning("No Scheme Mapped with this department");
        }
      }
    );

  }

  onSubmit() {
    //debugger;
    // this.dbtDataForm.patchValue({
    //   schemeCode:this.schemeCode
    // });
    //console.log(this.dbtDataForm.value['schemeCode']);
    this.dbtDataService.GetMisSchemedtls(this.dbtDataForm.value['schemeCode']).subscribe(x => {
      if (x.data) {
        this.dataSource = new MatTableDataSource<misMonthWiseReportDtls>(x.data);
        const monthToIndex = (m: any): number => {
          const s = (m ?? '').toString().trim().toLowerCase();
          const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
          const idx = months.findIndex(abbr => s.startsWith(abbr));
          return idx === -1 ? 13 : idx + 1;
        };
        this.dataSource.sortingDataAccessor = (item: any, property: string) => {
          switch (property) {
            case 'MonthName': return monthToIndex(item.monthname ?? item.MonthName);
            case 'no_of_state_central': return item.no_of_state_central;
            case 'no_of_state': return item.no_of_state;
            case 'TotalBen': return item.totalben ?? item.TotalBen;
            case 'TotalBenDigitized': return item.totalbendigitized ?? item.TotalBenDigitized;
            case 'BenAadharSeeded': return item.benaadharseeded ?? item.BenAadharSeeded;
            case 'MobileCaptured': return item.mobilecaptured ?? item.MobileCaptured;
            case 'central_share': return item.central_share;
            case 'state_share': return item.state_share;
            case 'add_state_contribution': return item.add_state_contribution;
            case 'FundTrnsferCash': return item.fundTrnsferCash ?? item.fundtrnsfercash;
            case 'state_contribution_for_additional': return item.state_contribution_for_additional;
            case 'grand_total': return item.grand_total;
            case 'NoTrnsCashElectronic': return item.notrnscashelectronic ?? item.NoTrnsCashElectronic;
            case 'AmntTrnsCashElectronic': return item.amnttrnscashelectronic ?? item.AmntTrnsCashElectronic;
            case 'NoTrnsCashOther': return item.notrnscashOther ?? item.notrnscashother ?? item.NoTrnsCashOther;
            case 'AmntTrnsCashOther': return item.amnttrnscashother ?? item.AmntTrnsCashOther;
            default: return item[property];
          }
        };
        // this.dataSource.paginator = this.paginator;
        this.array = x.data;
        this.totalSize = this.array.length;
        this.currentPage = 0;
        this.tableflag = true;
        setTimeout(() => {
          if (this.paginator) {
            this.dataSource.paginator = this.paginator;
            this.paginator.firstPage();
          }
          if (this.sort) {
            this.dataSource.sort = this.sort;
          }
        });
      }
      else {
        this.tableflag = false;
        this.toastr.error('Data is not found');
      }

    });

  }
  public handlePage(e: any) {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    // this.iterator();
  }
  private iterator() {
    const end = (this.currentPage + 1) * this.pageSize;
    const start = this.currentPage * this.pageSize;
    const part = this.array.slice(start, end);
    this.dataSource = part;
  }

  exportToExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'MonthWiseReport' + Date().valueOf() + '.xlsx');
  }

  // saveAsExcelFile(buffer: any, fileName: string): void {
  //   const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
  //   const url = window.URL.createObjectURL(data);
  //   const link = document.createElement('a');
  //   link.href = url;
  //   link.download = `${fileName}.xlsx`;
  //   link.click();
  // }


  searchScheme(e: any) {
    if (e !== undefined) {
      let term = '';
      if (e.target.value.length > 0) {
        term = e.target.value;
      }
      if (term !== undefined && term !== '' && term != null) {
        if (term.length > 0) {
          const lowerTerm = String(term).toLowerCase();
          this.filteredScheme = this.CopyschemeList?.filter((data: any) => {
            return String(data.schemeName).toLowerCase().indexOf(lowerTerm) >= 0 ||
              String(data.id).toLowerCase().indexOf(lowerTerm) >= 0;
          });
        }
      } else {
        this.filteredScheme = this.CopyschemeList;
      }
    }
  }



  displaySchemeFn(schemeId: number): string {
    // Find the scheme by ID
    const scheme = this.schemeList?.find((s: any) => s.id === schemeId);
    return scheme ? scheme.schemeName : '';
  }

}
