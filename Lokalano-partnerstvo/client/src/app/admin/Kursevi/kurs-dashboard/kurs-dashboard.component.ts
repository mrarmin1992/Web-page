import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { AccountService } from 'src/app/account/account.service';
import { KurseviService } from 'src/app/kursevi/kursevi.service';
import { ConfirmationDialogService } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.service';
import { IKategorije } from 'src/app/shared/models/kategorije';
import { Kurs } from 'src/app/shared/models/kurs';
import { KursParams } from 'src/app/shared/models/kursParams';
// tslint:disable-next-line: typedef
declare function getValueAtIndex(index: number);

@Component({
  selector: 'app-kurs-dashboard',
  templateUrl: './kurs-dashboard.component.html',
  styleUrls: ['./kurs-dashboard.component.scss']
})
export class KursDashboardComponent implements OnInit, OnDestroy {
  isAdmin$: Observable<boolean>;
  alive = true;
  @ViewChild('search', {static: false}) searchTerm: ElementRef;
  kursevi: Kurs[];
  kategorije: IKategorije[];
  kursParams = new KursParams();
  totalCount: number;
  sortOptions = [
    {name: 'Početak od novijeg prema starijem', value: 'datumPocetka'},
    {name: 'Početak od starijeg prema novijem', value: 'datumPocetkaDesc'},
    {name: 'Objava od novije prema starijoj', value: 'datumObjave'},
    {name: 'Objava od starije prema novijoj', value: 'datumObjaveDesc'},
    {name: 'Naziv abecedno', value: 'naziv'}
  ];
  constructor(private kurseviService: KurseviService,
              private cds: ConfirmationDialogService,
              private accountService: AccountService) { }
  ngOnDestroy(): void {
    this.alive = false;
  }

  ngOnInit(): void {
    this.isAdmin$ = this.accountService.isAdmin$;
    this.kursParams.pageSize = 10;
    this.getKursevi();
    this.getKategorije();
  }

  // tslint:disable-next-line: typedef
  getKursevi() {
    this.kurseviService.getKursevi(this.kursParams)
    .pipe(takeWhile(() => this.alive))
    .subscribe((response) => {
      this.kursevi = response.data;
      this.kursParams.pageNumber = response.pageIndex;
      this.kursParams.pageSize = response.pageSize;
      this.totalCount = response.count;
    }, error => {
      console.log(error);
    });
  }

  // tslint:disable-next-line: typedef
  getKategorije() {
    this.kurseviService.getKurseviKategorije().subscribe(response => {
      this.kategorije = [{id: 0, naziv: 'Sve'}, ...response];
    }, error => {
      console.log(error);
    });
  }
  // tslint:disable-next-line: typedef
  onKategorijaSelected(kategorijaId: number) {
    console.log(kategorijaId);
    this.kursParams.kategorijaId = kategorijaId;
    this.kursParams.pageNumber = 1;
    this.getKursevi();
  }

  // tslint:disable-next-line: typedef
  onSortSelected(sort: string) {
    this.kursParams.sort = sort;
    this.getKursevi();
  }

  // tslint:disable-next-line: typedef
  onPageChanged(event: any) {
    if (this.kursParams.pageNumber !== event) {
      this.kursParams.pageNumber = event;
      this.getKursevi();
    }
  }

  // tslint:disable-next-line: typedef
  onSearch() {
    this.kursParams.search = this.searchTerm.nativeElement.value;
    this.kursParams.pageNumber = 1;
    this.getKursevi();
  }

  // tslint:disable-next-line: typedef
  onReset() {
    this.searchTerm.nativeElement.value = '';
    this.kursParams = new KursParams();
    this.kursParams.pageSize = 10;
    this.getKursevi();
  }
  // tslint:disable-next-line: typedef
  deleteKurs(id: number) {
    this.cds.confirm('Pažnja', 'Jeste li sigurni da želite obrisati odabranu vijest?', 'Obriši', 'Odustani')
    // tslint:disable-next-line: align
    .then((confirmed) => {
    if (confirmed) {
      this.kurseviService.deleteKurs(id).subscribe((response: any) => {
        this.kursevi.splice(this.kursevi.findIndex(p => p.id === id), 1);
        this.totalCount--;
      });
    }
  });
}
}
