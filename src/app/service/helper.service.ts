import { Injectable } from '@angular/core';
// import { DataUploadLevelType, MasterCodeType, Progress_Type, Scheme_Type, Transfer_Type } from 'src/app_enum';
import { CodeValues } from '../model/code-values.model';
import { MasterService } from './master.service';
import { DataUploadLevelType, Progress_Type, Scheme_Type, Transfer_Type } from '../../app_enum';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  constructor(private masterService: MasterService) { }

  getProgress(progress: any){
    return Progress_Type[progress];
  }
  getSchemeType(code: any){
    return Scheme_Type[code];
  }
  getTransferType(code: any){
    return Transfer_Type[code];
  }
  getDataUploadLevelType(code: any){
    return DataUploadLevelType[code];
  }

}
