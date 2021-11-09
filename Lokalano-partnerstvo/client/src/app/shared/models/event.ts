export interface Event {
  id: number;
  naziv: string;
  aktivan: boolean;
  brojPolaznika: number;
  cijena: number;
  datumPocetka: Date;
  kategorija: string;
  objavio: string;
  opis: string;
  trajanje: number;
}
