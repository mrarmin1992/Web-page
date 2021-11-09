export interface Prijava {
  id: number;
  ime: string;
  prezime: string;
  datumRodjenja: Date;
  datumPrijave: Date;
  email: string;
  telefon: string;
  zanimanje: string;
  pogledano: boolean;
  kursId: number;
  obukaId: number;
  prethodnoZnanje: string;
  objava: string;
}

export interface PrijavaToCreate {
  ime: string;
  prezime: string;
  datumRodjenja: string;
  datumPrijave: string;
  email: string;
  telefon: string;
  zanimanje: string;
  pogledano: boolean;
  kursId: number;
  obukaId: number;
  prethodnoZnanje: string;
  objava: string;
}

export class PrijavaFormValues implements PrijavaToCreate {
  ime = '';
  prezime = '';
  datumRodjenja = Date.now.toString();
  datumPrijave = Date.now.toString();
  email = '';
  telefon = '';
  zanimanje = '';
  pogledano = false;
  kursId = null;
  obukaId = null;
  prethodnoZnanje = '';
  objava = '';

  constructor(init?: PrijavaFormValues) {
    Object.assign(this, init);
  }
}
