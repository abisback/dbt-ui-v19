import { SchemeBudgetComponent } from "../scheme-budget/scheme-budget.component";
import { Scheme } from "./scheme.model";

export interface SchemeBudget {
    id:number;
    scheme_Id:number;
    finYr:number;
    financialYear:string;
    fundingPattern:string;
    centralAllocation:number;
    stateAllocation:number;
    additionalAllocation:number;
    totalAllocation:number;
    remarks:string;
    createdOn:string;
    modifiedOn:string;
    createdBy:string;
    modifiedBy:string;
    isActive:boolean;
    scheme:Scheme;
}