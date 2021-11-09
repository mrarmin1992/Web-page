import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IKategorije } from '../shared/models/kategorije';
import { Kurs, KursFormValues } from '../shared/models/kurs';
import { KursParams } from '../shared/models/kursParams';
import { Pagination } from '../shared/models/pagination';

@Injectable({
  providedIn: 'root',
})
export class KurseviService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}
  // tslint:disable-next-line: typedef
  getAllKursevi(kursParams: KursParams) {
    let params = new HttpParams();

    if (kursParams.kategorijaId !== 0) {
      params = params.append(
        'KursKategorijaId',
        kursParams.kategorijaId.toString()
      );
    }
    if (kursParams.search) {
      params = params.append('Search', kursParams.search);
    }
    if (kursParams.partner) {
      params = params.append('objava', kursParams.partner);
    }
    params = params.append('sort', kursParams.sort);
    params = params.append('PageIndex', kursParams.pageNumber.toString());
    params = params.append('PageSize', kursParams.pageSize.toString());
    return this.http
      .get<Pagination>(this.baseUrl + 'kursevi/all', {
        observe: 'response',
        params,
      })
      .pipe(
        map((response) => {
          return response.body;
        })
      );
  }
  // tslint:disable-next-line: typedef
  getKursevi(kursParams: KursParams) {
    let params = new HttpParams();

    if (kursParams.kategorijaId !== 0) {
      params = params.append(
        'KursKategorijaId',
        kursParams.kategorijaId.toString()
      );
    }
    if (kursParams.search) {
      params = params.append('Search', kursParams.search);
    }
    params = params.append('sort', kursParams.sort);
    params = params.append('PageIndex', kursParams.pageNumber.toString());
    params = params.append('PageSize', kursParams.pageSize.toString());
    return this.http
      .get<Pagination>(this.baseUrl + 'kursevi', {
        observe: 'response',
        params,
      })
      .pipe(
        map((response) => {
          return response.body;
        })
      );
  }
  // tslint:disable-next-line: typedef
  getKurs(id: number) {
    return this.http.get<Kurs>(this.baseUrl + 'kursevi/' + id);
  }

  // tslint:disable-next-line: typedef
  getKursPrijava(id: number) {
    return this.http.get<Kurs>(this.baseUrl + 'kursevi/' + id + '/prijava');
  }

  // tslint:disable-next-line: typedef
  getKurseviKategorije() {
    return this.http.get<IKategorije[]>(
      this.baseUrl + 'Kursevi/KursKategorije'
    );
  }
  // tslint:disable-next-line: typedef
  createKurs(kurs: KursFormValues) {
    return this.http.post(this.baseUrl + 'kursevi', kurs);
  }

  // tslint:disable-next-line: typedef
  updateKurs(kurs: KursFormValues, id: number) {
    return this.http.put(this.baseUrl + 'kursevi/' + id, kurs);
  }

  // tslint:disable-next-line: typedef
  deleteKurs(id: number) {
    return this.http.delete(this.baseUrl + 'kursevi/' + id);
  }
}
