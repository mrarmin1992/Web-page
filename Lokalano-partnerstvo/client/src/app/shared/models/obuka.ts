export interface Obuka {
  id: number;
  naziv: string;
  aktivan: boolean;
  brojPolaznika: number;
  cijena: number;
  datumObjave: Date;
  datumPocetka: Date;
  obukaKategorija: string;
  obukaKategorijaId: number;
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
export interface ObukaToCreate {
  naziv: string;
  aktivna: boolean;
  brojPolaznika: number;
  cijena: number;
  datumObjave: string;
  datumPocetka: string;
  fokus: boolean;
  obukaKategorijaId: number;
  opis: string;
  kratakOpis: string;
  trajanje: number;
  imageUrl: string;
}

export class ObukaFormValues implements ObukaToCreate {
  naziv = '';
  aktivna = true;
  brojPolaznika = 0;
  cijena = 0;
  datumObjave = Date.now.toString();
  datumPocetka = Date.now.toString();
  fokus = false;
  obukaKategorijaId: number;
  opis = '';
  kratakOpis = '';
  trajanje = 0;
  imageUrl = '';

  constructor(init?: ObukaFormValues) {
    Object.assign(this, init);
  }
}
