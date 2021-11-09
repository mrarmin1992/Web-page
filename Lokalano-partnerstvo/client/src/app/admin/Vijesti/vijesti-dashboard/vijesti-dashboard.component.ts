import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { AccountService } from 'src/app/account/account.service';
import { ConfirmationDialogService } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.service';
import { Vijest } from '../../../shared/models/vijest';
import { VijestiKategorije } from '../../../shared/models/vijestiKategorije';
import { VijestiParams } from '../../../shared/models/vijestiParams';
import { VijestiService } from '../../../vijesti/vijesti.service';

@Component({
  selector: 'app-vijesti-dashboard',
  templateUrl: './vijesti-dashboard.component.html',
  styleUrls: ['./vijesti-dashboard.component.scss']
})
export class VijestiDashboardComponent implements OnInit, OnDestroy {
  isAdmin$: Observable<boolean>;
  alive = true;
  @ViewChild('search', {static: false}) searchTerm: ElementRef;
  vijesti: Vijest[];
  kategorije: VijestiKategorije[];
  vijestiParams = new VijestiParams();
  totalCount: number;
  sortOptions = [
    {name: 'Datum od novijeg prema starijem', value: 'DateDesc'},
    {name: 'Datum od starijeg prema novijem', value: 'DateAsc'},
    {name: 'Naslov abecedno', value: 'Naslov'}
  ];
  constructor(private vijestiService: VijestiService,
              private cds: ConfirmationDialogService,
              private accountService: AccountService) { }
  ngOnDestroy(): void {
    this.alive = false;
  }

  ngOnInit(): void {
    this.isAdmin$ = this.accountService.isAdmin$;
    this.vijestiParams.pageSize = 10;
    this.getVijesti();
    this.getKategorije();
  }

  // tslint:disable-next-line: typedef
  getVijesti() {
    this.vijestiService.getVijesti(this.vijestiParams)
    .pipe(takeWhile(() => this.alive))
    .subscribe((response) => {
      this.vijesti = response.data;
      this.vijestiParams.pageNumber = response.pageIndex;
      this.vijestiParams.pageSize = response.pageSize;
      this.totalCount = response.count;
    }, error => {
      console.log(error);
    });
  }

  // tslint:disable-next-line: typedef
  getKategorije() {
    this.vijestiService.getVijestiKategorije().subscribe(response => {
      this.kategorije = [{id: 0, naziv: 'Sve'}, ...response];
    }, error => {
      console.log(error);
    });
  }
  // tslint:disable-next-line: typedef
  onKategorijaSelected(kategorijaId: number) {
    this.vijestiParams.kategorijaId = kategorijaId;
    this.vijestiParams.pageNumber = 1;
    this.getVijesti();
  }

  // tslint:disable-next-line: typedef
  onSortSelected(sort: string) {
    this.vijestiParams.sort = sort;
    this.getVijesti();
  }

  // tslint:disable-next-line: typedef
  onPageChanged(event: any) {
    if (this.vijestiParams.pageNumber !== event) {
      this.vijestiParams.pageNumber = event;
      this.getVijesti();
    }
  }

  // tslint:disable-next-line: typedef
  onSearch() {
    this.vijestiParams.search = this.searchTerm.nativeElement.value;
    this.vijestiParams.pageNumber = 1;
    this.getVijesti();
  }

  // tslint:disable-next-line: typedef
  onReset() {
    this.searchTerm.nativeElement.value = '';
    this.vijestiParams = new VijestiParams();
    this.vijestiParams.pageSize = 10;
    this.getVijesti();
  }
  // tslint:disable-next-line: typedef
  deleteVijest(id: number) {
    this.cds.confirm('Pažnja', 'Jeste li sigurni da želite obrisati odabranu vijest?', 'Obriši', 'Odustani')
      .then((confirmed) => {
        if (confirmed) {
          this.vijestiService.deleteVijest(id).subscribe((response: any) => {
            this.vijesti.splice(this.vijesti.findIndex(p => p.id === id), 1);
            this.totalCount--;
          });
        }
      });
  }
}
