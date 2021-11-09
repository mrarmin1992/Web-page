import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Pagination } from '../shared/models/pagination';
import { Prijava, PrijavaFormValues } from '../shared/models/prijava';
import { PrijavaParams } from '../shared/models/prijavaParams';

@Injectable({
  providedIn: 'root'
})
export class PrijavaService {
  baseUrl = environment.apiUrl;
  private prijaveCountSource = new BehaviorSubject<number>(null);
  prijaveCount$ = this.prijaveCountSource.asObservable();
  prijavaParams = new PrijavaParams();

  constructor(private http: HttpClient) { }

  // tslint:disable-next-line: typedef
  getPrijavePogledano(prijavaParams: PrijavaParams) {
    let params = new HttpParams();

    if (prijavaParams.search) {
      params = params.append('Search', prijavaParams.search);
    }
    params = params.append('pogledano', 'false');
    params = params.append('sort', prijavaParams.sort);
    params = params.append('PageIndex', prijavaParams.pageNumber.toString());
    params = params.append('PageSize', prijavaParams.pageSize.toString());
    return this.http.get<Pagination>(this.baseUrl + 'prijave/pregled', {observe: 'response', params})
      .pipe(
        map(response => {
          return response.body;
        })
      );
  }

  // tslint:disable-next-line: typedef
  getPrijave() {
    let params = new HttpParams();
    console.log(this.prijavaParams);

    if (this.prijavaParams.search) {
      params = params.append('Search', this.prijavaParams.search);
    }
    if (this.prijavaParams.kursId !== null) {
      params = params.append('KursId', this.prijavaParams.kursId);
    }

    if (this.prijavaParams.obukaId !== null) {
      params = params.append('ObukaId', this.prijavaParams.obukaId);
    }
    if (this.prijavaParams.pogledano === 'true') {
      params = params.append('pogledano', 'true');
    }
    else if (this.prijavaParams.pogledano === 'false') {
      params = params.append('pogledano', 'false');
    }
    params = params.append('sort', this.prijavaParams.sort);
    params = params.append('PageIndex', this.prijavaParams.pageNumber.toString());
    params = params.append('PageSize', this.prijavaParams.pageSize.toString());
    return this.http.get<Pagination>(this.baseUrl + 'prijave', {observe: 'response', params})
      .pipe(
        map(response => {
          return response.body;
        })
      );
  }

  // tslint:disable-next-line: typedef
  getPrijava(id: number) {
    return this.http.get<Prijava>(this.baseUrl + 'prijave/' + id);
  }

  getPrijaveCount() {
    return this.http.get(this.baseUrl + 'prijave/count');
  }
  // tslint:disable-next-line: typedef
  updatePrijava(prijava: Prijava, id: number) {
    return this.http.put(this.baseUrl + 'prijave/' + id, prijava);
  }
  // tslint:disable-next-line: typedef
  createPrijava(prijava: PrijavaFormValues) {
    return this.http.post(this.baseUrl + 'prijave', prijava);
  }

  // tslint:disable-next-line: typedef
  getPrijaveCountValue() {
    return this.prijaveCountSource.value;
  }

  // tslint:disable-next-line: typedef
  loadPrijaveCount(token: string) {
    return this.http.get(this.baseUrl + 'prijave/count').pipe(
      map((count: number) => {
        if (count) {
          this.prijaveCountSource.next(count);
        }
      })
    );
  }

  setPrijavaParams(params: PrijavaParams): void {
    this.prijavaParams = params;
  }

  getPrijavaParams(): PrijavaParams {
    return this.prijavaParams;
  }

  deletePrijava(id: number): Observable<object> {
    return this.http.delete(this.baseUrl + 'prijave/' + id);
  }
}
