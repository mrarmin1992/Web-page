import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ForgotPasswordDto } from 'src/app/shared/models/ForgotPasswordDto';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  primaryColor: string;
  secondaryColor: string;
  color = '#555';
  hoverColor = '#555';
  public forgotPasswordForm: FormGroup;
  public successMessage: string;
  public errorMessage: string;
  public showSuccess: boolean;
  public showError: boolean;

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    this.changeTheme(this.hoverColor, this.color);
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required])
    });
  }
  changeTheme(primary: string, secondary: string): void {
    document.documentElement.style.setProperty('--primary-color', primary);
    document.documentElement.style.setProperty('--secondary-color', secondary);
  }
  public validateControl = (controlName: string) => {
    return this.forgotPasswordForm.controls[controlName].invalid && this.forgotPasswordForm.controls[controlName].touched;
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.forgotPasswordForm.controls[controlName].hasError(errorName);
  }

  public forgotPassword = (forgotPasswordFormValue) => {
    this.showError = this.showSuccess = false;

    const forgotPass = { ...forgotPasswordFormValue };
    const forgotPassDto: ForgotPasswordDto = {
      email: forgotPass.email,
      clientURI: 'https://localhost:4200/account/resetpassword'
    };

    this.accountService.forgotPassword(forgotPassDto)
    .subscribe(_ => {
      this.showSuccess = true;
      this.successMessage = 'Link je poslan. Posjetite Vaš mail za resetovanje lozinke.';
    },
    err => {
      this.showError = true;
      if (err.error.statusCode === 400) {
        this.errorMessage = 'Unešena mail adresa nije u ispravnom formatu.';
      }
      else if (err.error.statusCode === undefined) {
        this.errorMessage = 'Unešena mail adresa nije pronađena.';
      }
    });
  }
}
