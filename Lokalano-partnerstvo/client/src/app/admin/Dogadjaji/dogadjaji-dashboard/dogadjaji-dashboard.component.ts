import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { AccountService } from 'src/app/account/account.service';
import { DogadjajiService } from 'src/app/dogadjaji/dogadjaji.service';
import { ConfirmationDialogService } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.service';
import { Dogadjaj } from 'src/app/shared/models/dogadjaj';
import { DogadjajiKategorije } from 'src/app/shared/models/dogadjajiKategorije';
import { DogadjajiParams } from 'src/app/shared/models/dogadjajiParams';

@Component({
  selector: 'app-dogadjaji-dashboard',
  templateUrl: './dogadjaji-dashboard.component.html',
  styleUrls: ['./dogadjaji-dashboard.component.scss']
})
export class DogadjajiDashboardComponent implements OnInit, OnDestroy {
  isAdmin$: Observable<boolean>;
  alive = true;
  @ViewChild('search', {static: false}) searchTerm: ElementRef;
  dogadjaji: Dogadjaj[];
  kategorije: DogadjajiKategorije[];
  dogadjajiParams = new DogadjajiParams();
  totalCount: number;
  sortOptions = [
    {name: 'Početak od novijeg prema starijem', value: 'datumPocetka'},
    {name: 'Početak od starijeg prema novijem', value: 'datumPocetkaDesc'},
    {name: 'Objava od novije prema starijoj', value: 'datumObjave'},
    {name: 'Objava od starije prema novijoj', value: 'datumObjaveDesc'},
    {name: 'Naziv abecedno', value: 'naziv'}
  ];
  constructor(private dogadjajiService: DogadjajiService,
              private cds: ConfirmationDialogService,
              private accountService: AccountService) { }
  ngOnDestroy(): void {
    this.alive = false;
  }

  ngOnInit(): void {
    this.isAdmin$ = this.accountService.isAdmin$;
    this.dogadjajiParams.pageSize = 10;
    this.getDogadjaji();
    this.getKategorije();
  }

  // tslint:disable-next-line: typedef
  getDogadjaji() {
    this.dogadjajiService.getDogadjaji(this.dogadjajiParams)
    .pipe(takeWhile(() => this.alive))
    .subscribe((response) => {
      this.dogadjaji = response.data;
      this.dogadjajiParams.pageNumber = response.pageIndex;
      this.dogadjajiParams.pageSize = response.pageSize;
      this.totalCount = response.count;
    }, error => {
      console.log(error);
    });
  }

  // tslint:disable-next-line: typedef
  getKategorije() {
    this.dogadjajiService.getDogadjajiKategorije().subscribe(response => {
      this.kategorije = [{id: 0, naziv: 'Sve'}, ...response];
    }, error => {
      console.log(error);
    });
  }
  // tslint:disable-next-line: typedef
  onKategorijaSelected(kategorijaId: number) {
    this.dogadjajiParams.kategorijaId = kategorijaId;
    this.dogadjajiParams.pageNumber = 1;
    this.getDogadjaji();
  }

  // tslint:disable-next-line: typedef
  onSortSelected(sort: string) {
    this.dogadjajiParams.sort = sort;
    this.getDogadjaji();
  }

  // tslint:disable-next-line: typedef
  onPageChanged(event: any) {
    if (this.dogadjajiParams.pageNumber !== event) {
      this.dogadjajiParams.pageNumber = event;
      this.getDogadjaji();
    }
  }

  // tslint:disable-next-line: typedef
  onSearch() {
    this.dogadjajiParams.search = this.searchTerm.nativeElement.value;
    this.dogadjajiParams.pageNumber = 1;
    this.getDogadjaji();
  }

  // tslint:disable-next-line: typedef
  onReset() {
    this.searchTerm.nativeElement.value = '';
    this.dogadjajiParams = new DogadjajiParams();
    this.dogadjajiParams.pageSize = 10;
    this.getDogadjaji();
  }
  // tslint:disable-next-line: typedef
  deleteDogadjaj(id: number) {
    this.cds.confirm('Pažnja', 'Jeste li sigurni da želite obrisati odabrani događaj?', 'Obriši', 'Odustani')
      .then((confirmed) => {
        if (confirmed) {
          this.dogadjajiService.deleteDogadjaj(id).subscribe((response: any) => {
            this.dogadjaji.splice(this.dogadjaji.findIndex(p => p.id === id), 1);
            this.totalCount--;
          });
        }
      });
  }
}
