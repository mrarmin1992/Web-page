import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountService } from '../account/account.service';
import { ConfirmationDialogService } from '../shared/components/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  primaryColor: string;
  secondaryColor: string;
  color = '#555';
  hoverColor = '#555';
  isAdmin$: Observable<boolean>;
  email: string;
  constructor(
    private accountService: AccountService,
    private router: Router,
    private cds: ConfirmationDialogService
  ) {
    this.changeTheme(this.hoverColor, this.color);
  }

  changeTheme(primary: string, secondary: string): void {
    document.documentElement.style.setProperty('--primary-color', primary);
    document.documentElement.style.setProperty('--secondary-color', secondary);
  }

  ngOnInit(): void {
    this.isAdmin$ = this.accountService.isAdmin$;
    this.email = this.accountService.getCurrentUserValue().email;
  }
  odjava() {
    this.cds
      .confirm(
        'Odjava',
        'Jeste li sigurni da se želite odjaviti?',
        'Odjavi se',
        'Odustani'
      )
      .then((confirm) => {
        if (confirm) {
          this.accountService.logout();
        }
      });
  }
}
