import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { AccountService } from 'src/app/account/account.service';
import { PrijavaService } from 'src/app/prijava/prijava.service';
import { ConfirmationDialogService } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.service';
import { Prijava } from 'src/app/shared/models/prijava';
import { PrijavaParams } from 'src/app/shared/models/prijavaParams';
import { IUser } from 'src/app/shared/models/user';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  primaryColor: string;
  secondaryColor: string;
  color = '#fff';
  hoverColor = '#555'
  alive = true;
  componentDestroyed$: Subject<boolean> = new Subject();
  prijave: Prijava[];
  totalCount: any;
  currentUser$: Observable<IUser>;
  prijaveParams = new PrijavaParams();

  constructor(
    private accountService: AccountService,
    private prijaveService: PrijavaService,
    private router: Router,
    private cds: ConfirmationDialogService
  ) {
    this.changeTheme(this.color, this.hoverColor);
  }
  changeTheme(primary: string, secondary: string): void {
    document.documentElement.style.setProperty('--primary-color', primary);
    document.documentElement.style.setProperty('--secondary-color', secondary);
  }
  ngOnDestroy(): void {
    this.alive = false;
  }

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.currentUser$ = this.accountService.currentUser$;
    this.prijaveParams.pogledano = true;
    this.prijaveService
      .getPrijavePogledano(this.prijaveParams)
      .pipe(takeWhile(() => this.alive))
      .subscribe((response) => {
        this.prijave = response.data;
        this.prijaveParams.pageNumber = response.pageIndex;
        this.prijaveParams.pageSize = response.pageSize;
        this.totalCount = response.count;
      });
  }

  // tslint:disable-next-line: typedef
  logout() {
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
