import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PartneriService } from '../admin/Korisnici/partneri.service';
import { DogadjajiService } from '../dogadjaji/dogadjaji.service';
import { KurseviService } from '../kursevi/kursevi.service';
import { Dogadjaj } from '../shared/models/dogadjaj';
import { DogadjajiParams } from '../shared/models/dogadjajiParams';
import { Kurs } from '../shared/models/kurs';
import { KursParams } from '../shared/models/kursParams';
import { PartnerIme } from '../shared/models/PartnerIme';
import { Vijest } from '../shared/models/vijest';
import { VijestiKategorije } from '../shared/models/vijestiKategorije';
import { VijestiParams } from '../shared/models/vijestiParams';
import { VijestiService } from './vijesti.service';


@Component({
  selector: 'app-vijesti',
  templateUrl: './vijesti.component.html',
  styleUrls: ['./vijesti.component.scss']
})
export class VijestiComponent implements OnInit {
  primaryColor: string;
  secondaryColor: string;
  color = '#555';
  hoverColor = '#555';
  @ViewChild('search', {static: false}) searchTerm: ElementRef;
  vijesti: Vijest[];
  vijestiParams = new VijestiParams();
  kursevi: Kurs[];
  kursParams = new KursParams();
  kursTotalCount: number;
  dogadjaji: Dogadjaj[];
  dogadjajParams = new DogadjajiParams();
  dogadjajTotalCount: number;
  kategorije: VijestiKategorije[];
  totalCount: number;
  partneri: PartnerIme[];
  sortOptions = [
    {name: 'Abecedno', value: 'Naslov'},
    {name: 'Datum objave', value: 'DateAsc'},
    {name: 'Datum objave desc', value: 'DateDesc'}
  ];
  constructor(private vijestiService: VijestiService,
              private kursService: KurseviService,
              private dogadjajiService: DogadjajiService,
              private partneriService: PartneriService) { }

  ngOnInit(): void {
    this.changeTheme(this.color, this.hoverColor);
    this.vijestiParams.pageSize = 4;
    this.getVijesti();
    this.getKursevi();
    this.getDogadjaji();
    this.partneriService.getPartneriImena().subscribe(partneri => {
      this.partneri = partneri;
    }, error => {
      console.log(error);
    });
    this.getKategorije();
  }
  getDogadjaji(): void {
    this.dogadjajParams.pageSize = 3;
    this.dogadjajiService.getAllDogadjaji(this.dogadjajParams).subscribe(resp => {
      this.dogadjaji = resp.data;
      this.dogadjajTotalCount = resp.count;
    });
  }
  getKursevi(): void {
    this.kursParams.pageSize = 4;
    this.kursService.getAllKursevi(this.kursParams).subscribe(resp => {
      this.kursevi = resp.data;
      this.kursTotalCount = resp.count;
    });
  }
  changeTheme(primary: string, secondary: string): void {
    document.documentElement.style.setProperty('--primary-color', primary);
    document.documentElement.style.setProperty('--secondary-color', secondary);
  }

  // tslint:disable-next-line: typedef
  getVijesti() {
    this.vijestiService.getAllVijesti(this.vijestiParams).subscribe((response) => {
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

  onPartnerSelected(ime: string): void {
    if (ime !== null) {
      this.vijestiParams.partner = ime;
      this.vijestiParams.pageNumber = 1;
      this.getVijesti();
    } else {
      this.vijestiParams.partner = null;
      this.vijestiParams.pageNumber = 1;
      this.getVijesti();
    }
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
    this.getVijesti();
  }
}
