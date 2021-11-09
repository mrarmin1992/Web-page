export interface Publikacija {
  id: number;
  naziv: string;
  autor: string;
  datumObjavljivanja: Date;
  objavio: string;
  opis: string;
  path: string;
  fileName: string;
  photoPath: string;
}
export interface Fajl {
  id: number;
  path: string;
  fileName: string;
}
export interface PubToCreate {

  naziv: string;
  autor: string;
  datumObjavljivanja: string;
  opis: string;
  path: string;
  photoPath: string;
  fileName: string;
}

export class PubFormValues implements PubToCreate {
  naziv = '';
  autor = '';
  datumObjavljivanja = Date.now.toString();
  opis = ' ';
  path = '';
  photoPath = '';
  fileName = null;

  constructor(init?: PubFormValues) {
    Object.assign(this, init);
  }
}
