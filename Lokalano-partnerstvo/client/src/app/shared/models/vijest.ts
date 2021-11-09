export interface Vijest {
  id: number;
  naslov: string;
  podnaslov: string;
  datum: Date;
  fokus: boolean;
  objavio: string;
  vijestKategorija: string;
  vijestKategorijaId: number;
  sadrzaj: string;
  imageUrl: string;
  photo: Photo;
}

export interface Photo {
  id: number;
  imageUrl: string;
  fileName: string;
}
export interface VijestToCreate {

  naslov: string;
  podnaslov: string;
  datum: string;
  fokus: boolean;
  vijestKategorijaId: number;
  sadrzaj: string;
  imageUrl: string;
}

export class VijestFormValues implements VijestToCreate {
  naslov = '';
  podnaslov = '';
  datum = Date.now.toString();
  fokus = false;
  vijestKategorijaId: number;
  sadrzaj = '';
  imageUrl = '';

  constructor(init?: VijestFormValues) {
    Object.assign(this, init);
  }
}
