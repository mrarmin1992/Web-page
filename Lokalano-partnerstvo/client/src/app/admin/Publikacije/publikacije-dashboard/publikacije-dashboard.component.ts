import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { AccountService } from 'src/app/account/account.service';
import { PublikacijeService } from 'src/app/publikacije/publikacije.service';
import { ConfirmationDialogService } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.service';
import { Publikacija } from 'src/app/shared/models/publikacija';
import { PublikacijaParams } from 'src/app/shared/models/publikacijaParams';

@Component({
  selector: 'app-publikacije-dashboard',
  templateUrl: './publikacije-dashboard.component.html',
  styleUrls: ['./publikacije-dashboard.component.scss']
})
export class PublikacijeDashboardComponent implements OnInit, OnDestroy {
  isAdmin$: Observable<boolean>;
  alive = true;
  @ViewChild('search', {static: false}) searchTerm: ElementRef;
  search: string;
  publikacije: Publikacija[];
  totalCount: number;
  publikacijeParams = new PublikacijaParams();

  constructor(private publikacijeService: PublikacijeService,
              private cds: ConfirmationDialogService,
              private accountService: AccountService) { }
  ngOnDestroy(): void {
    this.alive = false;
  }

  ngOnInit(): void {
    this.isAdmin$ = this.accountService.isAdmin$;
    this.loadPublikacije();
  }
  loadPublikacije(): void {
    this.publikacijeService.getPublikacije(this.publikacijeParams)
    .pipe(takeWhile(() => this.alive))
    .subscribe(response => {
      this.publikacije = response.data;
      this.totalCount = response.count;
      this.publikacijeParams.pageNumber = response.pageIndex;
      this.publikacijeParams.pageSize = response.pageSize;
    });
  }

  onDelete(id: number): void {
    this.cds.confirm('Pažnja', 'Jeste li sigurni da želite obrisati odabrani dokument?', 'Obriši', 'Odustani')
      .then((confirmed) => {
        if (confirmed) {
          this.publikacijeService.deletePublikacija(id).subscribe(response => {
            this.loadPublikacije();
          }, error => {
            console.log(error);
          });
        }
      });
  }
  onSearch(): void {
    const params = this.publikacijeParams;
    params.search = this.searchTerm.nativeElement.value;
    params.pageNumber = 1;
    this.loadPublikacije();
  }

  onReset(): void {
    this.publikacijeParams = new PublikacijaParams();
    this.searchTerm.nativeElement.value = '';
    this.loadPublikacije();
  }
}
