import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination } from '../shared/models/pagination';
import { VijestiKategorije } from '../shared/models/vijestiKategorije';
import { map } from 'rxjs/operators';
import { VijestiParams } from '../shared/models/vijestiParams';
import { Vijest, VijestFormValues } from '../shared/models/vijest';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VijestiService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // tslint:disable-next-line: typedef
  getAllVijesti(vijestiParams: VijestiParams) {
    let params = new HttpParams();

    if (vijestiParams.kategorijaId !== 0) {
      params = params.append('VijestKategorijaId', vijestiParams.kategorijaId.toString());
    }
    if (vijestiParams.search) {
      params = params.append('Search', vijestiParams.search);
    }
    if (vijestiParams.partner) {
      params = params.append('objava', vijestiParams.partner);
    }
    params = params.append('sort', vijestiParams.sort);
    params = params.append('PageIndex', vijestiParams.pageNumber.toString());
    params = params.append('PageSize', vijestiParams.pageSize.toString());
    return this.http.get<Pagination>(this.baseUrl + 'vijesti/all', {observe: 'response', params})
      .pipe(
        map(response => {
          return response.body;
        })
      );
  }
  // tslint:disable-next-line: typedef
  getVijesti(vijestiParams: VijestiParams) {
    let params = new HttpParams();

    if (vijestiParams.kategorijaId !== 0) {
      params = params.append('VijestKategorijaId', vijestiParams.kategorijaId.toString());
    }
    if (vijestiParams.search) {
      params = params.append('Search', vijestiParams.search);
    }
    params = params.append('sort', vijestiParams.sort);
    params = params.append('PageIndex', vijestiParams.pageNumber.toString());
    params = params.append('PageSize', vijestiParams.pageSize.toString());
    return this.http.get<Pagination>(this.baseUrl + 'vijesti', {observe: 'response', params})
      .pipe(
        map(response => {
          return response.body;
        })
      );
  }

  // tslint:disable-next-line: typedef
  getVijest(id: number) {
    return this.http.get<Vijest>(this.baseUrl + 'vijesti/' + id);
  }

  // tslint:disable-next-line: typedef
  getVijestiKategorije() {
    return this.http.get<VijestiKategorije[]>(this.baseUrl + 'Vijesti/VijestKategorije');
  }
  // tslint:disable-next-line: typedef
  createVijest(vijest: VijestFormValues) {
    return this.http.post(this.baseUrl + 'vijesti', vijest);
  }

  // tslint:disable-next-line: typedef
  updateVijest(vijest: VijestFormValues, id: number) {
    return this.http.put(this.baseUrl + 'vijesti/' + id, vijest);
  }

  // tslint:disable-next-line: typedef
  deleteVijest(id: number) {
    return this.http.delete(this.baseUrl + 'vijesti/' + id);
  }
}
