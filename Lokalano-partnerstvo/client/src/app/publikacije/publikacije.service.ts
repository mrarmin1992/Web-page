import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Pagination } from '../shared/models/pagination';
import { PubFormValues, Publikacija } from '../shared/models/publikacija';
import { PublikacijaParams } from '../shared/models/publikacijaParams';

@Injectable({
  providedIn: 'root'
})
export class PublikacijeService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  // tslint:disable-next-line: typedef
  getPublikacije(publikacijaParams: PublikacijaParams) {
    let params = new HttpParams();

    if (publikacijaParams.search) {
      params = params.append('Search', publikacijaParams.search);
    }
    params = params.append('sort', publikacijaParams.sort);
    params = params.append('PageIndex', publikacijaParams.pageNumber.toString());
    params = params.append('PageSize', publikacijaParams.pageSize.toString());
    return this.http.get<Pagination>(this.baseUrl + 'publikacije', {observe: 'response', params})
      .pipe(
        map(response => {
          return response.body;
        })
      );
  }

  getPublikacija(id: number) {
    return this.http.get<Publikacija>(this.baseUrl + 'publikacije/' + id);
  }

  // tslint:disable-next-line: typedef
  updatePublikacija(pub: PubFormValues, id: number) {
    return this.http.put(this.baseUrl + 'publikacije/' + id, pub);
  }

  // tslint:disable-next-line: typedef
  createPublikacija(publikacija: PubFormValues) {
    return this.http.post(this.baseUrl + 'publikacije', publikacija);
  }
  // tslint:disable-next-line: typedef
  deletePublikacija(id: number) {
    return this.http.delete(this.baseUrl + 'publikacije/' + id);
  }
}
