import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { AccountService } from 'src/app/account/account.service';
import { ObukeService } from 'src/app/obuke/obuke.service';
import { ConfirmationDialogService } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.service';
import { Obuka } from 'src/app/shared/models/obuka';
import { ObukaParams } from 'src/app/shared/models/obukaParams';
import { ObukeKategorije } from 'src/app/shared/models/obukeKategorije';

@Component({
  selector: 'app-obuke-dashboard',
  templateUrl: './obuke-dashboard.component.html',
  styleUrls: ['./obuke-dashboard.component.scss']
})
export class ObukeDashboardComponent implements OnInit, OnDestroy {
  isAdmin$: Observable<boolean>;
  alive = true;
  @ViewChild('search', {static: false}) searchTerm: ElementRef;
  obuke: Obuka[];
  kategorije: ObukeKategorije[];
  obukaParams = new ObukaParams();
  totalCount: number;
  sortOptions = [
    {name: 'Početak od novijeg prema starijem', value: 'datumPocetka'},
    {name: 'Početak od starijeg prema novijem', value: 'datumPocetkaDesc'},
    {name: 'Objava od novije prema starijoj', value: 'datumObjave'},
    {name: 'Objava od starije prema novijoj', value: 'datumObjaveDesc'},
    {name: 'Naziv abecedno', value: 'naziv'}
  ];
  constructor(private obukeService: ObukeService,
              private cds: ConfirmationDialogService,
              private accountService: AccountService) { }
  ngOnDestroy(): void {
    this.alive = false;
  }

  ngOnInit(): void {
    this.isAdmin$ = this.accountService.isAdmin$;
    this.obukaParams.pageSize = 10;
    this.getObuke();
    this.getKategorije();
  }

  // tslint:disable-next-line: typedef
  getObuke() {
    this.obukeService.getObuke(this.obukaParams)
    .pipe(takeWhile(() => this.alive))
    .subscribe((response) => {
      this.obuke = response.data;
      this.obukaParams.pageNumber = response.pageIndex;
      this.obukaParams.pageSize = response.pageSize;
      this.totalCount = response.count;
    }, error => {
      console.log(error);
    });
  }

  // tslint:disable-next-line: typedef
  getKategorije() {
    this.obukeService.getObukeKategorije().subscribe(response => {
      this.kategorije = [{id: 0, naziv: 'Sve'}, ...response];
    }, error => {
      console.log(error);
    });
  }
  // tslint:disable-next-line: typedef
  onKategorijaSelected(kategorijaId: number) {
    this.obukaParams.kategorijaId = kategorijaId;
    this.obukaParams.pageNumber = 1;
    this.getObuke();
  }

  // tslint:disable-next-line: typedef
  onSortSelected(sort: string) {
    this.obukaParams.sort = sort;
    this.getObuke();
  }

  // tslint:disable-next-line: typedef
  onPageChanged(event: any) {
    if (this.obukaParams.pageNumber !== event) {
      this.obukaParams.pageNumber = event;
      this.getObuke();
    }
  }

  // tslint:disable-next-line: typedef
  onSearch() {
    this.obukaParams.search = this.searchTerm.nativeElement.value;
    this.obukaParams.pageNumber = 1;
    this.getObuke();
  }

  // tslint:disable-next-line: typedef
  onReset() {
    this.searchTerm.nativeElement.value = '';
    this.obukaParams = new ObukaParams();
    this.obukaParams.pageSize = 10;
    this.getObuke();
  }
  // tslint:disable-next-line: typedef
  deleteObuka(id: number) {
    this.cds.confirm('Pažnja', 'Jeste li sigurni da želite obrisati odabranu obuku?', 'Obriši', 'Odustani')
      .then((confirmed) => {
        if (confirmed) {
          this.obukeService.deleteObuka(id).subscribe((response: any) => {
            this.obuke.splice(this.obuke.findIndex(p => p.id === id), 1);
            this.totalCount--;
          });
        }
      });
  }

}
