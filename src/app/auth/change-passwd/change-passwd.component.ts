import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { SharedModule } from '../../shared/shared.module';
import * as CryptoJS from "crypto-js";
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-passwd',
  imports: [SharedModule],
  templateUrl: './change-passwd.component.html',
  styleUrl: './change-passwd.component.scss'
})
export class ChangePasswdComponent {

  hideOldPassword: boolean = true;
  hideNewPassword: boolean = true;
  hideConfirmPassword: boolean = true;

  encryptedPasswordOld!: string;
  encryptedPasswordNew!: string;
  encryptedPasswordCon!: string;
  changePassword = new FormGroup({
    oldpassword: new FormControl('', [Validators.required,
    Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&#])[A-Za-z\\d$@$!%*?&#]{8,16}$')
    ]),
    password: new FormControl('', [Validators.required,
    Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&#])[A-Za-z\\d$@$!%*?&#]{8,16}$')
    ]),
    confirmPassword: new FormControl('', [Validators.required,])
  }, {
    // At least 8 characters in length max 16 characters
    // Lowercase letters
    // Uppercase letters
    // Numbers
    // Special characters
  })


  constructor(private userService: UserService, private toastr: ToastrService,  private router: Router) {

  }


  ngOnInit(): void {
  }

  togglePasswordVisibility(field: string): void {
    switch (field) {
      case 'oldPassword':
        this.hideOldPassword = !this.hideOldPassword;
        break;
      case 'newPassword':
        this.hideNewPassword = !this.hideNewPassword;
        break;
      case 'confirmPassword':
        this.hideConfirmPassword = !this.hideConfirmPassword;
        break;
      default:
        break;
    }
  }

  get f() {

    return this.changePassword.controls;

  }


  onSubmit() {
    if (this.changePassword.valid) {
      //console.log(this.encryptedPasswordOld,this.encryptedPasswordNew, this.encryptedPasswordCon );

      // this.changePassword.setValue({
      //   oldpassword: this.encryptedPasswordOld,
      //   password: this.encryptedPasswordNew,
      //   confirmPassword: this.encryptedPasswordCon
      // });
      const payload = {
        oldpassword: this.encryptedPasswordOld,
        password: this.encryptedPasswordNew,
        confirmPassword: this.encryptedPasswordCon
      }

      //alert("Password Submitted");
      //console.log(this.changePassword.value);
      this.userService.ChangePassword(payload).subscribe(response => {
        if (response.errorMessage != null) {
          this.toastr.error(response.errorMessage);
        } else {
          this.changePassword.reset();
          this.toastr.success("Password Changed Successfully");
          this.router.navigate(['dashboard']);
        }
      });
    }
  }

  encryptPassword(op: any) {

    if (op == 1) {
      const key = CryptoJS.enc.Utf8.parse(environment.AesKey);
      const iv = CryptoJS.enc.Utf8.parse(environment.AesIV);
      this.encryptedPasswordOld = CryptoJS.AES.encrypt(
        this.changePassword.get('oldpassword')?.value ?? '',
        key,
        {
          keySize: 128 / 8,
          iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        }
      ).toString();

    }
    else if (op == 2) {
      const key = CryptoJS.enc.Utf8.parse(environment.AesKey);
      const iv = CryptoJS.enc.Utf8.parse(environment.AesIV);
      this.encryptedPasswordNew = CryptoJS.AES.encrypt(
        this.changePassword.get('password')?.value ?? '',
        key,
        {
          keySize: 128 / 8,
          iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        }
      ).toString();
    }
    else if (op == 3) {
      const key = CryptoJS.enc.Utf8.parse(environment.AesKey);
      const iv = CryptoJS.enc.Utf8.parse(environment.AesIV);
      this.encryptedPasswordCon = CryptoJS.AES.encrypt(
        this.changePassword.get('confirmPassword')?.value ?? '',
        key,
        {
          keySize: 128 / 8,
          iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        }
      ).toString();
    }

  }
}
