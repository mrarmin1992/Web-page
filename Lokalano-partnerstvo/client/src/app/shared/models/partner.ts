export interface Partner {
  id: number;
  userId: string;
  ime: string;
  opis: string;
  telefon: string;
  fax: string;
  mail: string;
  adresa: string;
  web: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  youtube: string;
  twitter: string;
  imageUrl: string;
  photo: Photo;
}

export interface Photo {
  id: number;
  imageUrl: string;
  fileName: string;
}

export interface PartnerToCreate {
  userId: string;
  ime: string;
  opis: string;
  telefon: string;
  fax: string;
  mail: string;
  adresa: string;
  web: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  youtube: string;
  twitter: string;
  imageUrl: string;
}

export interface PartnerToUpdate {
  opis: string;
  telefon: string;
  fax: string;
  adresa: string;
  web: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  youtube: string;
  twitter: string;
  imageUrl: string;
}

export class PartnerFormValues implements PartnerToCreate {
  userId = '';
  ime = '';
  opis = '';
  telefon = '';
  fax = '';
  mail = '';
  adresa = '';
  web = '';
  facebook = '';
  instagram = '';
  tiktok = '';
  youtube = '';
  twitter = '';
  imageUrl = '';

  constructor(init?: PartnerFormValues) {
    Object.assign(this, init);
  }

}
