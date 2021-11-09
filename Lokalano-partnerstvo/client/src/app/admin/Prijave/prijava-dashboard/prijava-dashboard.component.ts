import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KurseviService } from 'src/app/kursevi/kursevi.service';
import { ObukeService } from 'src/app/obuke/obuke.service';
import { PrijavaService } from 'src/app/prijava/prijava.service';
import { Event } from 'src/app/shared/models/event';
import { Kurs } from 'src/app/shared/models/kurs';
import { Obuka } from 'src/app/shared/models/obuka';
import { Prijava } from 'src/app/shared/models/prijava';

@Component({
  selector: 'app-prijava-dashboard',
  templateUrl: './prijava-dashboard.component.html',
  styleUrls: ['./prijava-dashboard.component.scss']
})
export class PrijavaDashboardComponent implements OnInit {
  id: number;
  prijava: Prijava;
  event: Event;

  constructor(private prijavaService: PrijavaService,
              private route: ActivatedRoute,
              private kursService: KurseviService,
              private obukaService: ObukeService) { }

  ngOnInit(): void {
    this.id = +this.route.snapshot.url[1].path;
    this.prijavaService.getPrijava(this.id).subscribe(prijava => {
      this.prijava = prijava;
      if (prijava.kursId !== null) {
        this.kursService.getKurs(prijava.kursId).subscribe(kurs => {
          this.loadKurs(kurs);
        });
      } else {
        this.obukaService.getObuka(prijava.obukaId).subscribe(obuka => {
          this.loadObuka(obuka);
        });
      }
    });
  }

  checkValue(pogledano: boolean): void {
    this.prijava.pogledano = pogledano;
    this.prijavaService.updatePrijava(this.prijava, this.prijava.id).subscribe(prijava => {
      console.log(prijava);
    }, error => {
      console.log(error);
    });
  }
  loadKurs(kurs: Kurs): void {
    this.event = {
      id: kurs.id,
      naziv: kurs.naziv,
      aktivan: kurs.aktivan,
      brojPolaznika: kurs.brojPolaznika,
      cijena: kurs.cijena,
      datumPocetka: kurs.datumPocetka,
      kategorija: kurs.kursKategorija,
      objavio: kurs.objavio,
      opis: kurs.opis,
      trajanje: kurs.trajanje
    };
  }
  loadObuka(obuka: Obuka): void {
    this.event = {
      id: obuka.id,
      naziv: obuka.naziv,
      aktivan: obuka.aktivan,
      brojPolaznika: obuka.brojPolaznika,
      cijena: obuka.cijena,
      datumPocetka: obuka.datumPocetka,
      kategorija: obuka.obukaKategorija,
      objavio: obuka.objavio,
      opis: obuka.opis,
      trajanje: obuka.trajanje
    };
  }
}
