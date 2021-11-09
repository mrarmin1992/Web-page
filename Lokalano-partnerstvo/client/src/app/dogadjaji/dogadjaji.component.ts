import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PartneriService } from '../admin/Korisnici/partneri.service';
import { KurseviService } from '../kursevi/kursevi.service';
import { Dogadjaj } from '../shared/models/dogadjaj';
import { DogadjajiKategorije } from '../shared/models/dogadjajiKategorije';
import { DogadjajiParams } from '../shared/models/dogadjajiParams';
import { Kurs } from '../shared/models/kurs';
import { KursParams } from '../shared/models/kursParams';
import { PartnerIme } from '../shared/models/PartnerIme';
import { Vijest } from '../shared/models/vijest';
import { VijestiParams } from '../shared/models/vijestiParams';
import { VijestiService } from '../vijesti/vijesti.service';
import { DogadjajiService } from './dogadjaji.service';

@Component({
  selector: 'app-dogadjaji',
  templateUrl: './dogadjaji.component.html',
  styleUrls: ['./dogadjaji.component.scss']
})
export class DogadjajiComponent implements OnInit {
  primaryColor: string;
  secondaryColor: string;
  color = '#555';
  hoverColor = '#555';
  @ViewChild('search', {static: false}) searchTerm: ElementRef;
  dogadjaji: Dogadjaj[];
  kategorije: DogadjajiKategorije[];
  dogadjajiParams = new DogadjajiParams();
  vijesti: Vijest[];
  vijestiParams = new VijestiParams();
  kursevi: Kurs[];
  kurseviParams = new KursParams();
  totalCount: number;
  partneri: PartnerIme[];
  sortOptions = [
    {name: 'Abecedno', value: 'Naslov'},
    {name: 'Datum objave', value: 'DateAsc'},
    {name: 'Datum objave desc', value: 'DateDesc'}
  ];
  constructor(private dogadjajiService: DogadjajiService,
              private vijestiService: VijestiService,
              private kursService: KurseviService,
              private partneriService: PartneriService) { }

  ngOnInit(): void {
    this.changeTheme(this.color, this.hoverColor);
    this.dogadjajiParams.pageSize = 4;
    this.getDogadjaji();
    this.getKategorije();
    this.getVijesti();
    this.getKursevi();
    this.getPartneri();
  }
  getPartneri(): void {
    this.partneriService.getPartneriImena().subscribe(partneri => {
      this.partneri = partneri;
    }, error => {
      console.log(error);
    });
  }
  getKursevi(): void {
    this.kurseviParams.pageSize = 3;
    this.kursService.getAllKursevi(this.kurseviParams).subscribe(resp => {
      this.kursevi = resp.data;
    }, error => {
      console.log(error);
    })
  }
  getVijesti(): void {
    this.vijestiParams.pageSize = 3;
    this.vijestiService.getAllVijesti(this.vijestiParams).subscribe(resp => {
      this.vijesti = resp.data;
    }, error => {
      console.log(error);
    });
  }

  changeTheme(primary: string, secondary: string): void {
    document.documentElement.style.setProperty('--primary-color', primary);
    document.documentElement.style.setProperty('--secondary-color', secondary);
  }

  // tslint:disable-next-line: typedef
  getDogadjaji() {
    this.dogadjajiService.getAllDogadjaji(this.dogadjajiParams).subscribe((response) => {
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
  onPartnerSelected(ime: string): void {
    if (ime !== null) {
      this.dogadjajiParams.partner = ime;
      this.dogadjajiParams.pageNumber = 1;
      this.getDogadjaji();
    } else {
      this.dogadjajiParams.partner = null;
      this.dogadjajiParams.pageNumber = 1;
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
    this.getDogadjaji();
  }

}
