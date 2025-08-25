import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import * as CryptoJS from "crypto-js";
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-sign-in',
  imports: [SharedModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {

  //passwordVisible = false;
  hidePassword: boolean = true;

  messageClass = ""
  message = ""
  userid: any;
  editdata: any;
  responsedata: any;
  encryptedPassword!: string;
  imageUrl: any;
  captchaId!: string;
  loginForm: FormGroup = new FormGroup({
    userId: new FormControl("", Validators.required),
    password: new FormControl("", Validators.required)
  });
  schemeCodeListObject: any;

  otploginForm: FormGroup = new FormGroup({
    mobileNo: new FormControl("", Validators.required),
    password: new FormControl("", Validators.required)
  });
  submitted = false;

  constructor(private formBuilder: FormBuilder, private srvc: AuthService,
    private route: Router, private sanitizer: DomSanitizer, private toastr: ToastrService) {

    //  localStorage.clear();
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      userId: [
        '',
        [
          Validators.required,
          Validators.maxLength(60)
        ]
      ],
      password: [
        '',
        Validators.required
      ],
      captchaCode: [

        '', Validators.required
      ],
      captchaId: [

      ],
    });
    this.getCaptchaImg();
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }



  get f(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  ProceedLogin() {
    //console.log(this.loginForm.value);
    let b = this.loginForm.valid;
    if (this.loginForm.valid) {
      //console.log(this.loginForm);
      this.loginForm.setValue({
        userId: this.loginForm.get('userId')?.value,
        password: this.encryptedPassword,
        captchaCode: this.loginForm.get('captchaCode')?.value,
        //captchaId:this.loginForm.get('captchaId')?.value
        captchaId: this.captchaId
      });
      // console.log(this.loginForm.value);
      this.srvc.proceedLogin(this.loginForm.value).subscribe(result => {
        if (result != null) {
          if (result.body?.errorMessage == null) {
            this.responsedata = result;

            let secrettoken = result.headers.get('cat');
            localStorage.setItem("token", secrettoken || '');
            localStorage.setItem("username", result.body?.result.userId?.toString() || '');
            localStorage.setItem("email", result.body?.result.email || '');
            localStorage.setItem("role", result.body?.result.roleName || '');
            localStorage.setItem("deptCode", result.body?.result.deptCode?.toString() || '');

            // localStorage.setItem("deptCode", JSON.stringify(result.body?.result.deptCode?.toString() || ''));
            localStorage.setItem("schemeType", result.body?.result.schemeType?.toString() || '');
            localStorage.setItem("schemeCode", result.body?.result.schemeCode?.toString() || '');
            localStorage.setItem("CodeTypeId", result.body?.result.codeTypeId?.toString() || '');
            localStorage.setItem("userId", result.body?.result.id?.toString() || '');
// ================================== MY Addition +++++++++++++++++++++++++++++++++================================
            this.schemeCodeListObject = result.body?.result.schemeCodeList.reduce<Record<number, string>>((acc, item, index) => {
              acc[index] = item;
              return acc;
          }, {});
          localStorage.setItem("schemeCodeList",JSON.stringify(this.schemeCodeListObject) || "");


//============================================================================================================================
            //console.log(result.body?.result);
            //console.log(result.headers.get('cat'));
            //debugger;
            //
            this.route.navigate(['dashboard']);
            //console.log('Login done');
          } else {
            this.toastr.error(result.body.errorMessage);
          }
        }
      })
    }
  }

  ProceedOtpLogin() {
    //console.log(this.otploginForm.value);
    let b = this.otploginForm.valid;
    if (this.otploginForm.valid) {
      //console.log(this.loginForm);
      this.otploginForm.setValue({
        mobileNo: this.otploginForm.get('mobileNo')?.value,
        password: '1234'
      });
      // console.log(this.loginForm.value);
      this.srvc.proceedOtpLogin(this.otploginForm.value).subscribe((result: any) => {
        if (result != null) {
          if (result.body?.errorMessage == null) {
            this.responsedata = result;
            //console.log("Login:" + result);

            let secrettoken = result.headers.get('cat');
            localStorage.setItem("token", secrettoken || '');
            localStorage.setItem("username", result.body?.result.email || '');
            localStorage.setItem("email", result.body?.result.email || '');
            localStorage.setItem("role", result.body?.result.roleName || '');
            localStorage.setItem("deptCode", result.body?.result.deptCode?.toString() || '');
            localStorage.setItem("schemeType", result.body?.result.schemeType?.toString() || '');
            localStorage.setItem("schemeCode", result.body?.result.schemeCode?.toString() || '');
            localStorage.setItem("CodeTypeId", result.body?.result.codeTypeId?.toString() || '');
            localStorage.setItem("userId", result.body?.result.userId?.toString() || '');
            //console.log(result.body?.result);
            //console.log(result.headers.get('cat'));
            this.route.navigate(['dashboard']);
          } else {
            this.toastr.error(result.body.errorMessage);
          }
        }
      })
    }

  }
  getCaptchaImg() {
    this.srvc.getCaptchaImage().subscribe(response => {
      // debugger;
      const imgString = response.captchaImg.split('"')[1];
      this.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        'data:image/png;base64,' + imgString
      );
      this.captchaId = response.captchaId;
    }
    )
  }

  encryptPassword() {
    const key = CryptoJS.enc.Utf8.parse(environment.AesKey);
    const iv = CryptoJS.enc.Utf8.parse(environment.AesIV);
    this.encryptedPassword = CryptoJS.AES.encrypt(
      this.loginForm.get('password')?.value,
      key,
      {
        keySize: 128 / 8,
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    ).toString();
  }

  GenerateOtp() {
    this.toastr.success("Your OTP is 1234");
  }


}
