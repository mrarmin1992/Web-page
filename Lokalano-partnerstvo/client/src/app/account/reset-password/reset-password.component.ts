import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../account.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PasswordConfirmationValidatorService } from 'src/app/shared/password-confirmation-validator.service';
import { ResetPasswordDto } from 'src/app/shared/models/resetPasswordDto';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  primaryColor: string;
  secondaryColor: string;
  color = '#555';
  hoverColor = '#555';
  public resetPasswordForm: FormGroup;
  public showSuccess: boolean;
  public showError: boolean;
  public errorMessage: string;

  private token: string;
  private email: string;

  constructor(private accountService: AccountService,
              private passConfValidator: PasswordConfirmationValidatorService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.changeTheme(this.hoverColor, this.color);
    this.resetPasswordForm = new FormGroup({
      password: new FormControl('', [Validators.required]),
      confirm: new FormControl('')
    });
    this.resetPasswordForm.get('confirm').setValidators([Validators.required,
      this.passConfValidator.validateConfirmPassword(this.resetPasswordForm.get('password'))]);
    this.token = this.route.snapshot.queryParams.token;
    this.email = this.route.snapshot.queryParams.email;
  }
  changeTheme(primary: string, secondary: string): void {
    document.documentElement.style.setProperty('--primary-color', primary);
    document.documentElement.style.setProperty('--secondary-color', secondary);
  }
  public validateControl = (controlName: string) => {
    return this.resetPasswordForm.controls[controlName].invalid && this.resetPasswordForm.controls[controlName].touched;
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.resetPasswordForm.controls[controlName].hasError(errorName);
  }

  public resetPassword = (resetPasswordFormValue) => {
    this.showError = this.showSuccess = false;

    const resetPass = { ... resetPasswordFormValue };
    const resetPassDto: ResetPasswordDto = {
      password: resetPass.password,
      confirmPassword: resetPass.confirm,
      token: this.token,
      email: this.email
    };

    this.accountService.resetPassword(resetPassDto)
    .subscribe(_ => {
      this.showSuccess = true;
      setTimeout(() => {
        this.router.navigate(['/account/login']);
      }, 3000);
    },
    error => {
      console.log(error);
      this.showError = true;
      this.errorMessage = error.error.errors;
    });
  }
}
