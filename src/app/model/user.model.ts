export interface User {
    id :any;
    deptCode: number;
    userId:string;
    salutation: string;
    firstName: string;
    middleName: string;
    lastName: string;
    loginUserName: string;
    role: string;
    roleName: string;
    status: number;
    isActive: boolean;
    email: string;
    phoneNo: string;
    schemeType:number;
    schemeCode:string;
    profilePhotoUrl: string;
    codeTypeId:number;
    schemeCodeList: string[];
}

// export interface User {
//     id: string;                // UUID
//     deptCode: number;          // Department Code
//     userId: string;            // User ID
//     salutation: number;        // Salutation type (could be enum)
//     firstName: string;         // User's first name
//     middleName: string;        // User's middle name
//     lastName: string;          // User's last name
//     loginUserName: string;
//     role: string;              // User's role
//     status: number;            // Status (could represent active/inactive etc.)
//     isActive: boolean;         // Is the user active
//     email: string;             // User's email
//     phoneNo: string;           // User's phone number
//     schemeType: number;        // Scheme type (could be enum)
//     schemecode: string;        // Single scheme code
//     profilePhotoUrl: string;   // URL to the profile photo
//     codeTypeId: number;        // Code type ID
//     schemeCodeList: string[];  // List of scheme codes
//     password: string;          // Plain password
//     passwordHash: string;      // Hashed password
//     passwordSalt: string;      // Salt for the password
//     roleId: number;            // Role ID
// }
