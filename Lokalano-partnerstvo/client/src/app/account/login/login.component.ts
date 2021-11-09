import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../account.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  primaryColor: string;
  secondaryColor: string;
  color = '#555';
  hoverColor = '#555';
  loginForm: FormGroup;
  showError: boolean;
  errorMessage: string;

  constructor(private accountService: AccountService, private router: Router) { }

  ngOnInit(): void {
    this.changeTheme(this.hoverColor, this.color);
    this.createLoginForm();
  }
  changeTheme(primary: string, secondary: string): void {
    document.documentElement.style.setProperty('--primary-color', primary);
    document.documentElement.style.setProperty('--secondary-color', secondary);
  }
  // tslint:disable-next-line: typedef
  createLoginForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')]),
      password: new FormControl('', Validators.required)
    });
  }
  // tslint:disable-next-line: typedef
  onSubmit() {
    this.accountService.login(this.loginForm.value).subscribe(() => {
      this.router.navigateByUrl('/dashboard');
    }, error => {
      if (error.error.statusCode === 401) {
        this.showError = true;
        this.errorMessage = 'Unijeli ste pogrešan mail ili lozinku.';
      }
    });
  }

}
