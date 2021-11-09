export interface Dogadjaj {
    id: number;
    naziv: string;
    datumObjave: Date;
    datumPocetka: Date;
    vrijemePocetka: string;
    fokus: boolean;
    objavio: string;
    dogadjajKategorija: string;
    dogadjajKategorijaId: number;
    opis: string;
    imageUrl: string;
    photo: Photo;
  }

export interface Photo {
    id: number;
    imageUrl: string;
    fileName: string;
  }
export interface DogadjajToCreate {
    naziv: string;
    datumObjave: string;
    datumPocetka: string;
    vrijemePocetka: string;
    dogadjajKategorijaId: number;
    opis: string;
    objavio: string;
    imageUrl: string;
  }

export class DogadjajFormValues implements DogadjajToCreate {
    naziv = '';
    datumObjave = Date.now.toString();
    datumPocetka = Date.now.toString();
    vrijemePocetka = '';
    dogadjajKategorijaId: number;
    opis = '';
    objavio = '';
    imageUrl = '';

    constructor(init?: DogadjajFormValues) {
      Object.assign(this, init);
    }
  }

