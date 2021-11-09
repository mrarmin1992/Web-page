import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PartneriService } from 'src/app/admin/Korisnici/partneri.service';
import { DogadjajiService } from 'src/app/dogadjaji/dogadjaji.service';
import { KurseviService } from 'src/app/kursevi/kursevi.service';
import { ObukeService } from 'src/app/obuke/obuke.service';
import { VijestiService } from 'src/app/vijesti/vijesti.service';
import { Dogadjaj } from '../../models/dogadjaj';
import { DogadjajiParams } from '../../models/dogadjajiParams';
import { Kurs } from '../../models/kurs';
import { KursParams } from '../../models/kursParams';
import { Obuka } from '../../models/obuka';
import { ObukaParams } from '../../models/obukaParams';
import { Partner } from '../../models/partner';
import { PartnerParams } from '../../models/partnerParams';
import { Vijest } from '../../models/vijest';
import { VijestiParams } from '../../models/vijestiParams';

@Component({
  selector: 'app-partner',
  templateUrl: './partner.component.html',
  styleUrls: ['./partner.component.scss']
})
export class PartnerComponent implements OnInit {ć
  partnerIme: string;
  vijesti: Vijest[];
  vijestiParams = new VijestiParams();
  brojVijesti: number;
  kursevi: Kurs[];
  kursParams = new KursParams();
  brojKurseva: number;
  obuke: Obuka[];
  obukeParams = new ObukaParams();
  brojObuka: number;
  dogadjaji: Dogadjaj[];
  dogadjajiParams = new DogadjajiParams();
  brojDogadjaja: number;
  primaryColor: string;
  secondaryColor: string;
  color = '#555';
  hoverColor = '#555';
  partner: Partner;

  constructor(private partneriService: PartneriService,
              private route: ActivatedRoute,
              private vijestiService: VijestiService,
              private kursService: KurseviService,
              private obukeService: ObukeService,
              private dogadjajiService: DogadjajiService) { }

  ngOnInit(): void {
    this.changeTheme(this.color, this.hoverColor);
    this.partneriService.getPartner(this.route.snapshot.paramMap.get('mail')).subscribe((partner: Partner) => {
      this.partner = partner;
      this.partnerIme = partner.ime;
      this.getVijest(partner.ime);
      this.getKursevi(partner.ime);
      this.getObuke(partner.ime);
      this.getDogadjaji(partner.ime);

    }, error => {
      console.log(error);
    });
  }
  getDogadjaji(ime: string): void {
    this.dogadjajiParams.pageSize = 4;
    this.dogadjajiParams.partner = ime;
    this.dogadjajiService.getAllDogadjaji(this.dogadjajiParams).subscribe(resp => {
      this.dogadjaji = resp.data;
      this.brojDogadjaja = resp.count;
    }, error => {
      console.log(error);
    });
  }
  getObuke(ime: string): void {
    this.obukeParams.pageSize = 4;
    this.obukeParams.partner = ime;
    this.obukeService.getAllObuke(this.obukeParams).subscribe(resp => {
      this.obuke = resp.data;
      this.brojObuka = resp.count;
    }, error => {
      console.log(error);
    });
  }
  getKursevi(ime: string): void {
    this.kursParams.pageSize = 4;
    this.kursParams.partner = ime;
    this.kursService.getAllKursevi(this.kursParams).subscribe(resp => {
      console.log(resp.data);
      this.kursevi = resp.data;
      this.brojKurseva = resp.count;
    }, error => {
      console.log(error);
    });
  }
  getVijest(ime: string): void {
      this.vijestiParams.pageSize = 4;
      this.vijestiParams.partner = ime;
      this.vijestiService.getAllVijesti(this.vijestiParams).subscribe(resp => {
      this.vijesti = resp.data;
      this.brojVijesti = resp.count;
    }, error => {
      console.log(error);
    });
  }
  changeTheme(primary: string, secondary: string): void {
    document.documentElement.style.setProperty('--primary-color', primary);
    document.documentElement.style.setProperty('--secondary-color', secondary);
  }
  onVijestiPageChanged(event: any): void {
    if (this.vijestiParams.pageNumber !== event) {
      this.vijestiParams.pageNumber = event;
      this.getVijest(this.partnerIme);
    }
  }
  onKursPageChanged(event: any): void {
    if (this.kursParams.pageNumber !== event) {
      this.kursParams.pageNumber = event;
      this.getKursevi(this.partnerIme);
    }
  }
  onObukaPageChanged(event: any): void {
    if (this.obukeParams.pageNumber !== event) {
      this.obukeParams.pageNumber = event;
      this.getObuke(this.partnerIme);
    }
  }
  onDogadjajPageChanged(event: any): void {
    if (this.dogadjajiParams.pageNumber !== event) {
      this.dogadjajiParams.pageNumber = event;
      this.getDogadjaji(this.partnerIme);
    }
  }
}
