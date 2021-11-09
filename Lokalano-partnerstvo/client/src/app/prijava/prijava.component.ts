import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { KurseviService } from '../kursevi/kursevi.service';
import { ObukeService } from '../obuke/obuke.service';
import { ConfirmationDialogService } from '../shared/components/confirmation-dialog/confirmation-dialog.service';
import { Event } from '../shared/models/event';
import { Kurs } from '../shared/models/kurs';
import { Obuka } from '../shared/models/obuka';
import { PrijavaFormValues } from '../shared/models/prijava';
import { PrijavaService } from './prijava.service';

@Component({
  selector: 'app-prijava',
  templateUrl: './prijava.component.html',
  styleUrls: ['./prijava.component.scss']
})
export class PrijavaComponent implements OnInit {
  primaryColor: string;
  secondaryColor: string;
  color = '#555';
  hoverColor = '#555';
  id: string;
  prijava: PrijavaFormValues;
  kurs: Kurs;
  obuka: Obuka;
  event: Event;

  constructor(private prijavaService: PrijavaService,
              private route: ActivatedRoute,
              private router: Router,
              private cds: ConfirmationDialogService,
              private kursService: KurseviService,
              private obukaService: ObukeService) {
                this.prijava = new PrijavaFormValues();
               }

  ngOnInit(): void {
    this.changeTheme(this.color, this.hoverColor);
    this.id = this.route.snapshot.url[1].path;
    if (this.route.snapshot.url[0].path === 'prijava-kurs') {
      this.kursService.getKursPrijava(+this.id).subscribe(kurs => {
        this.loadKurs(kurs);
        console.log(this.event);
        this.kurs = kurs;
      });
    } else {
      this.obukaService.getObuka(+this.id).subscribe(obuka => {
        this.loadObuka(obuka);
        this.obuka = obuka;
        console.log(this.event);
      });
    }
  }

  changeTheme(primary: string, secondary: string): void {
    document.documentElement.style.setProperty('--primary-color', primary);
    document.documentElement.style.setProperty('--secondary-color', secondary);
  }

  onSubmit(prijava: PrijavaFormValues): void {
    console.log(prijava);
    const newPrijava = { ...prijava };
    if (this.kurs !== undefined) {
      newPrijava.kursId = this.kurs.id;
      newPrijava.obukaId = null;
    } else {
      newPrijava.obukaId = this.obuka.id;
      newPrijava.kursId = null;
    }
    newPrijava.pogledano = false;
    this.prijavaService.createPrijava(newPrijava).subscribe((response) => {
      this.router.navigate(['/hvala']);
    }, error => {
      console.log(error);
    });
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
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
