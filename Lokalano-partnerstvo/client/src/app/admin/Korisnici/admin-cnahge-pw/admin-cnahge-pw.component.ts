import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'src/app/account/account.service';
import { AdminPasswordReset } from 'src/app/shared/models/adminPasswordReset';
import { PasswordConfirmationValidatorService } from 'src/app/shared/password-confirmation-validator.service';

@Component({
  selector: 'app-admin-cnahge-pw',
  templateUrl: './admin-cnahge-pw.component.html',
  styleUrls: ['./admin-cnahge-pw.component.scss']
})
export class AdminCnahgePwComponent implements OnInit {
  public resetPasswordForm: FormGroup;
  public showSuccess: boolean;
  public showError: boolean;
  public errorMessage: string;
  private email: string;

  constructor(private accountService: AccountService,
              private passConfValidator: PasswordConfirmationValidatorService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.email = this.route.snapshot.paramMap.get('email');
    console.log(this.email);
    this.resetPasswordForm = new FormGroup({
      newpassword: new FormControl('', [Validators.required]),
      confirm: new FormControl('')
    });
    this.resetPasswordForm.get('confirm').setValidators([Validators.required,
      this.passConfValidator.validateConfirmPassword(this.resetPasswordForm.get('newpassword'))]);
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
    const resetPassDto: AdminPasswordReset = {
      password: resetPass.newpassword,
      email: this.email
    };

    this.accountService.adminPasswordReset(resetPassDto)
    .subscribe((response) => {
      this.showSuccess = true;
      setTimeout(() => {
        this.router.navigateByUrl('/dashboard/korisnici');
      }, 3000);
    },
    error => {
      this.showError = true;
      this.errorMessage = error.error.errors;
      console.log(error);
    });
  }
}
