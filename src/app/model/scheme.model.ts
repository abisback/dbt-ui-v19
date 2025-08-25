export interface Scheme {
    id: number;
    deptCode: number;
    deptName: string;
    schemeType: number;
    schemeName: string;
    schemeCode: string;
    dbtSchemeCode: string;
    transferType: string;
    fundingPattern: string;

    centralShare: number,
    stateShare: number,
    additionalStateShare: number,

    dbtSchemeCode_B: string;
    dbtSchemeCode_C: string;
    dbtSchemeCode_E: string;
    onBoarded: boolean;
    progress: number;
    mISIntegrated: boolean;
    isActive: boolean;
}

export interface SchemeView {
    schemeid: number;
    gender: string;
    caste: string;
    minage: number;
    maxage: number;
    religion: string;
    hasAadhar: number;
    hasSwasthasathi: number;
}
export interface BenDetails {
    schemeid: number;
    schemename: string;
    iseligible: string;
    isapplied: number;
}
export interface BenMatrix {
    dbtid: number;
    name: string;
    eligible: number;
    benefitted: number;
    benefitted_not_eligible: number;
}

export interface BenMatrix_New {
    dbtid: number;
    name: string;
    schemedetails: object;
}
export interface misMonthWiseReportDtls {
    monthname: string;
    no_of_state_central: number;
    no_of_state: number;
    TotalBen: number;
    TotalBenDigitized: number;
    BenAadharSeeded: number;
    MobileCaptured: number;
    central_share: number;
    state_share: number;
    add_state_contribution: number;
    FundTrnsferCash: number;
    state_contribution_for_additional: number;
    grand_total: number;
    NoTrnsCashElectronic: number;
    AmntTrnsCashElectronic: number;
    NoTrnsCashOther: number;
    AmntTrnsCashOther: number;
}

export interface misMonthWiseBenDtls {
    dbtid: number;
    benid: string;
    name: string;
    age: string;
    is_aadhar_validated: string;
    aadharvalidatedate: string;

}
export interface getLastMonthData {
    name: string;
    val: number;
    //row_num:bigint;
}