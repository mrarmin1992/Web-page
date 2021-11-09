export interface Kurs {
  id: number;
  naziv: string;
  aktivan: boolean;
  brojPolaznika: number;
  cijena: number;
  datumObjave: Date;
  datumPocetka: Date;
  kursKategorija: string;
  kursKategorijaId: number;
  objavio: string;
  opis: string;
  kratakOpis: string;
  trajanje: number;
  imageUrl: string;
  photo: Photo;
}
export interface Photo {
  id: number;
  imageUrl: string;
  fileName: string;
}
export interface KursToCreate {
  naziv: string;
  aktivna: boolean;
  brojPolaznika: number;
  cijena: number;
  datumObjave: string;
  datumPocetka: string;
  fokus: boolean;
  kursKategorijaId: number;
  opis: string;
  kratakOpis: string;
  trajanje: number;
  imageUrl: string;
}

export class KursFormValues implements KursToCreate {
  naziv = '';
  aktivna = true;
  brojPolaznika = 0;
  cijena = 0;
  datumObjave = Date.now.toString();
  datumPocetka = Date.now.toString();
  fokus = false;
  kursKategorijaId: number;
  opis = '';
  kratakOpis = '';
  trajanje = 0;
  imageUrl = '';

  constructor(init?: KursFormValues) {
    Object.assign(this, init);
  }

}

