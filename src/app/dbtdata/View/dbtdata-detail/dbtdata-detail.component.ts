import { Component, Inject } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { DBTData } from '../../../model/dbtdata.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HelperService } from '../../../service/helper.service';
import { DistrictService } from '../../../service/district.service';
import { DataUploadLevelType, Transfer_Type } from '../../../../app_enum';

@Component({
  selector: 'app-dbtdata-detail',
  imports: [SharedModule],
  templateUrl: './dbtdata-detail.component.html',
  styleUrl: './dbtdata-detail.component.scss'
})
export class DbtdataDetailComponent {


  public dbtData = new DBTData();
  isSchemeFound = true;
  showDistrict = true;
  showCashTypeField = true;
  showKindTypeField = true;
  districtName: string = "";

  constructor(
    public dialogRef: MatDialogRef<DbtdataDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DBTData,
    public helperService: HelperService,
    public districtService: DistrictService) { }

  ngOnInit(): void {
    this.dbtData = this.data;
    this.showDistrict = (this.dbtData.entryLevel == DataUploadLevelType["District Level"]);
    this.showCashTypeField = (this.dbtData.benefitType == Transfer_Type["Cash"]) || (this.dbtData.benefitType == Transfer_Type["Cash and In Kind"]);
    this.showKindTypeField = (this.dbtData.benefitType == Transfer_Type["In Kind"]) || (this.dbtData.benefitType == Transfer_Type["Cash and In Kind"]);
    if (this.showDistrict) {
      this.districtService.GetDistrict(this.dbtData.districtCode).subscribe(x => {
        this.districtName = x.result.districtName;
      });
    }
    //sconsole.log(this.dbtData);
  }
}
