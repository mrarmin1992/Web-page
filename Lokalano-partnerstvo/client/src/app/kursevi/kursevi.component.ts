import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PartneriService } from '../admin/Korisnici/partneri.service';
import { DogadjajiService } from '../dogadjaji/dogadjaji.service';
import { ObukeService } from '../obuke/obuke.service';
import { Dogadjaj } from '../shared/models/dogadjaj';
import { DogadjajiParams } from '../shared/models/dogadjajiParams';
import { IKategorije } from '../shared/models/kategorije';
import { Kurs } from '../shared/models/kurs';
import { KursParams } from '../shared/models/kursParams';
import { Obuka } from '../shared/models/obuka';
import { PartnerIme } from '../shared/models/PartnerIme';
import { Vijest } from '../shared/models/vijest';
import { VijestiParams } from '../shared/models/vijestiParams';
import { VijestiService } from '../vijesti/vijesti.service';
import { KurseviService } from './kursevi.service';

@Component({
  selector: 'app-kursevi',
  templateUrl: './kursevi.component.html',
  styleUrls: ['./kursevi.component.scss']
})
export class KurseviComponent implements OnInit {
  dogadjaji: Dogadjaj[];
  dogadjajiParams = new DogadjajiParams();
  vijesti: Vijest[];
  vijestiParams = new VijestiParams();
  primaryColor: string;
  secondaryColor: string;
  color = '#555';
  hoverColor = '#555';
  @ViewChild('search', {static: false}) searchTerm: ElementRef;
  kursevi: Kurs[];
  obuke: Obuka[];
  kategorije: IKategorije[];
  kursParams = new KursParams();
  kursTotalCount: number;
  obukaTotalCount: number;
  partneri: PartnerIme[];
  sortOptions = [
    {name: 'Abecedno', value: 'Naslov'},
    {name: 'Datum objave', value: 'DateAsc'},
    {name: 'Datum objave desc', value: 'DateDesc'}
  ];
  constructor(private kurseviService: KurseviService,
              private obukeService: ObukeService,
              private vijestiService: VijestiService,
              private dogadjajiService: DogadjajiService,
              private partneriService: PartneriService) { }

  ngOnInit(): void {
    this.changeTheme(this.color, this.hoverColor);
    this.kursParams.pageSize = 4;
    this.getKursevi();
    this.getObuke();
    this.getKategorije();
    this.getVijesti();
    this.getDogadjaji();
    this.getPartneri();
  }
  getPartneri(): void {
    this.partneriService.getPartneriImena().subscribe(partneri => {
      this.partneri = partneri;
    }, error => {
      console.log(error);
    });
  }
  getDogadjaji(): void {
    this.dogadjajiParams.pageSize = 4;
    this.dogadjajiService.getAllDogadjaji(this.dogadjajiParams).subscribe(resp => {
      this.dogadjaji = resp.data;
    });
  }
  getVijesti(): void {
    this.vijestiParams.pageSize = 4;
    this.vijestiService.getAllVijesti(this.vijestiParams).subscribe(resp => {
      this.vijesti = resp.data;
    });
  }
  getObuke(): void {
    this.obukeService.getAllObuke(this.kursParams).subscribe((response) => {
      this.obuke = response.data;
      this.kursParams.pageNumber = response.pageIndex;
      this.kursParams.pageSize = response.pageSize;
      this.obukaTotalCount = response.count;
    }, error => {
      console.log(error);
    });
  }

  changeTheme(primary: string, secondary: string): void {
    document.documentElement.style.setProperty('--primary-color', primary);
    document.documentElement.style.setProperty('--secondary-color', secondary);
  }

  getKursevi(): void {
      this.kurseviService.getAllKursevi(this.kursParams).subscribe((response) => {
      this.kursevi = response.data;
      this.kursParams.pageNumber = response.pageIndex;
      this.kursParams.pageSize = response.pageSize;
      this.kursTotalCount = response.count;
    }, error => {
      console.log(error);
    });
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
  getKategorije() {
    this.kurseviService.getKurseviKategorije().subscribe(response => {
      this.kategorije = [{id: 0, naziv: 'Sve'}, ...response];
    }, error => {
      console.log(error);
    });
  }
  // tslint:disable-next-line: typedef
  onKategorijaSelected(kategorijaId: number) {
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
    this.getObuke();
  }

  // tslint:disable-next-line: typedef
  onReset() {
    this.searchTerm.nativeElement.value = '';
    this.kursParams = new KursParams();
    this.kursParams.pageSize = 4;
    this.getObuke();
    this.getKursevi();
  }
}
