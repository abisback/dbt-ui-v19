export enum MasterCodeType
{
    Roles = 1,
    Genders = 2,
    Salutations = 3,
    Benefit_Type =  4,
    Progress_Type = 5,
    Scheme_Type = 6,
    Financial_Year = 7,
    DecisionType = 8,
    DataUploadLevel = 9,
    finYrCode=108,
    Caste=13,
    Marital_Status=14,
    Religion =15,
    Data_Share_Type=16
}

export enum DataUploadLevelType{
    "State Level" = 50,
    "District Level" = 51
}

export enum USERROLE{
    "Super Admin" = "SUPR",
    "State Level Admin" = "SADM",
    "Department Admin" = "DADM",
    "Department Operator" = "DOPT",
    "Department Nodal"="DNOD",
    "State Nodal"="SNOD"
}

export enum Progress_Type{
    "Online system / MIS at Conceptual Stage" =4,
    "Online system / MIS under development"= 5,
    "Online system / MIS implemented at field level (Roll out) and data reported manually" = 6,
    "Online system / MIS integrated with State DBT Portal but data reported manually" = 7,
    "Online system / MIS integrated with State DBT Portal and report submitted through web-services"=8 
}

export enum Scheme_Type{
    "Centrally Sponsored Scheme" = 15,
    "State/UTs Scheme"= 16
}

export enum Transfer_Type{
    "Cash" = 1,
    "In Kind" = 2,
    "Cash and In Kind" = 3,
}

