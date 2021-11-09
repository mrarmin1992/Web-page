import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { AccountService } from 'src/app/account/account.service';
import { ConfirmationDialogService } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.service';
import { IUsers } from 'src/app/shared/models/users';
import { UsersParams } from 'src/app/shared/models/usersParams';
import { PartneriService } from './partneri.service';

@Component({
  selector: 'app-korisnici',
  templateUrl: './korisnici.component.html',
  styleUrls: ['./korisnici.component.scss'],
})
export class KorisniciComponent implements OnInit, OnDestroy {
  alive = true;
  @ViewChild('search', { static: false }) searchTerm: ElementRef;
  users: IUsers[];
  usersParams: UsersParams;
  totalCount: number;
  sortOptions = [
    { name: 'Abecedno A-Z', value: 'nameAsc' },
    { name: 'Abecedno Z-A', value: 'nameDesc' },
  ];
  constructor(private accountService: AccountService,
              private cds: ConfirmationDialogService,
              private partneriService: PartneriService) {
    this.usersParams = this.accountService.getUsersParams();
  }
  ngOnDestroy(): void {
    this.alive = false;
  }

  ngOnInit(): void {
    this.loadUsers();
  }
  // tslint:disable-next-line: typedef
  loadUsers() {
    // tslint:disable-next-line: deprecation
    this.accountService.getUsers()
    .pipe(takeWhile(() => this.alive))
    .subscribe(
      (response) => {
        this.users = response.data;
        this.totalCount = response.count;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // tslint:disable-next-line: typedef
  onSortSelected(sort: string) {
    const params = this.accountService.getUsersParams();
    params.sort = sort;
    this.accountService.setUsersParams(params);
    this.loadUsers();
  }

  // tslint:disable-next-line: typedef
  onPageChanged(event: any) {
    const params = this.accountService.getUsersParams();
    if (params.pageNumber !== event) {
      params.pageNumber = event;
      this.accountService.setUsersParams(params);
      this.loadUsers();
    }
  }

  // tslint:disable-next-line: typedef
  onSearch() {
    const params = this.accountService.getUsersParams();
    params.search = this.searchTerm.nativeElement.value;
    params.pageNumber = 1;
    this.accountService.setUsersParams(params);
    this.loadUsers();
  }

  // tslint:disable-next-line: typedef
  onReset() {
    this.searchTerm.nativeElement.value = '';
    this.usersParams = new UsersParams();
    this.accountService.setUsersParams(this.usersParams);
    this.loadUsers();
  }

  onDelete(email: string): void {
    this.cds.confirm('Brisanje', 'Jeste li sigurni da želite obrisati odabranog člana ?', 'Obriši', 'Odustani')
    .then(confirm => {
      if (confirm){
        this.accountService.deleteUser(email).subscribe(response => {
          this.partneriService.deletePartner(email).subscribe(resp => {
          }, error => {
            console.log(error);
          });
          this.loadUsers();
        }, error => {
          console.log(error);
        });
      }
    });
  }
}
