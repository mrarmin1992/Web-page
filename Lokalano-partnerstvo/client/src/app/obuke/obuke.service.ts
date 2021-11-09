import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IKategorije } from '../shared/models/kategorije';
import { Obuka, ObukaFormValues } from '../shared/models/obuka';
import { ObukaParams } from '../shared/models/obukaParams';
import { Pagination } from '../shared/models/pagination';

@Injectable({
  providedIn: 'root',
})
export class ObukeService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  // tslint:disable-next-line: typedef
  getAllObuke(obukaParams: ObukaParams) {
    let params = new HttpParams();

    if (obukaParams.kategorijaId !== 0) {
      params = params.append(
        'ObukaKategorijaId',
        obukaParams.kategorijaId.toString()
      );
    }
    if (obukaParams.search) {
      params = params.append('Search', obukaParams.search);
    }
    if (obukaParams.partner) {
      params = params.append('objava', obukaParams.partner);
    }
    params = params.append('sort', obukaParams.sort);
    params = params.append('PageIndex', obukaParams.pageNumber.toString());
    params = params.append('PageSize', obukaParams.pageSize.toString());
    return this.http
      .get<Pagination>(this.baseUrl + 'obuka/all', {
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
  getObuke(obukaParams: ObukaParams) {
    let params = new HttpParams();

    if (obukaParams.kategorijaId !== 0) {
      params = params.append(
        'ObukaKategorijaId',
        obukaParams.kategorijaId.toString()
      );
    }
    if (obukaParams.search) {
      params = params.append('Search', obukaParams.search);
    }
    params = params.append('sort', obukaParams.sort);
    params = params.append('PageIndex', obukaParams.pageNumber.toString());
    params = params.append('PageSize', obukaParams.pageSize.toString());
    return this.http
      .get<Pagination>(this.baseUrl + 'obuka', { observe: 'response', params })
      .pipe(
        map((response) => {
          return response.body;
        })
      );
  }
  // tslint:disable-next-line: typedef
  getObuka(id: number) {
    return this.http.get<Obuka>(this.baseUrl + 'obuka/' + id);
  }
  // tslint:disable-next-line: typedef
  getObukeKategorije() {
    return this.http.get<IKategorije[]>(this.baseUrl + 'Obuka/ObukaKategorije');
  }

  // tslint:disable-next-line: typedef
  createObuka(obuka: ObukaFormValues) {
    return this.http.post(this.baseUrl + 'obuka', obuka);
  }

  // tslint:disable-next-line: typedef
  updateObuka(obuka: ObukaFormValues, id: number) {
    return this.http.put(this.baseUrl + 'obuka/' + id, obuka);
  }

  // tslint:disable-next-line: typedef
  deleteObuka(id: number) {
    return this.http.delete(this.baseUrl + 'obuka/' + id);
  }
}
