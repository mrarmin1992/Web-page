import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Pagination } from 'src/app/shared/models/pagination';
import { PartnerIme } from 'src/app/shared/models/PartnerIme';
import { PartnerParams } from 'src/app/shared/models/partnerParams';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PartneriService {
  baseUrl = environment.apiUrl;
  pagination = new Pagination();

  constructor(private http: HttpClient) { }

  // tslint:disable-next-line: typedef
  register(values: any) {
    return this.http.post(this.baseUrl + 'partneri', values);
  }

  getPartneri(partnerParams: PartnerParams): Observable<Pagination> {
    let params = new HttpParams();
    params = params.append('pageIndex', partnerParams.pageNumber.toString());
    params = params.append('pageSize', partnerParams.pageSize.toString());
    params = params.append('sort', partnerParams.sort);
    if (partnerParams.search) {
      params = params.append('search', partnerParams.search);
    }

    return this.http.get<Pagination>(this.baseUrl + 'partneri', { observe: 'response', params })
      .pipe(
        map(response => {
          this.pagination = response.body;
          return this.pagination;
        })
      );
  }

  getPartneriImena(): Observable<PartnerIme[]> {
    return this.http.get<PartnerIme[]>(this.baseUrl + 'partneri/ime');
  }

  deletePartner(email: string) {
    return this.http.delete(this.baseUrl + 'partneri/' + email);
  }

  getPartner(email: string) {
    return this.http.get(this.baseUrl + 'partneri/' + email);
  }
  updatePartner(id: number, values: any) {
    return this.http.put(this.baseUrl + 'partneri/' + id, values);
  }
}
