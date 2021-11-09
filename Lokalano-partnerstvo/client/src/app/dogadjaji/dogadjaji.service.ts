import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Dogadjaj, DogadjajFormValues } from '../shared/models/dogadjaj';
import { DogadjajiKategorije } from '../shared/models/dogadjajiKategorije';
import { DogadjajiParams } from '../shared/models/dogadjajiParams';
import { Pagination } from '../shared/models/pagination';

@Injectable({
  providedIn: 'root',
})
export class DogadjajiService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}
  // tslint:disable-next-line: typedef
  getAllDogadjaji(dogadjajiParams: DogadjajiParams) {
    let params = new HttpParams();

    if (dogadjajiParams.kategorijaId !== 0) {
      params = params.append(
        'DogadjajKategorijaId',
        dogadjajiParams.kategorijaId.toString()
      );
    }
    if (dogadjajiParams.search) {
      params = params.append('Search', dogadjajiParams.search);
    }
    if (dogadjajiParams.partner) {
      params = params.append('objava', dogadjajiParams.partner);
    }
    params = params.append('sort', dogadjajiParams.sort);
    params = params.append('PageIndex', dogadjajiParams.pageNumber.toString());
    params = params.append('PageSize', dogadjajiParams.pageSize.toString());
    return this.http
      .get<Pagination>(this.baseUrl + 'dogadjaji/all', {
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
  getDogadjaji(dogadjajiParams: DogadjajiParams) {
    let params = new HttpParams();

    if (dogadjajiParams.kategorijaId !== 0) {
      params = params.append(
        'DogadjajKategorijaId',
        dogadjajiParams.kategorijaId.toString()
      );
    }
    if (dogadjajiParams.search) {
      params = params.append('Search', dogadjajiParams.search);
    }
    params = params.append('sort', dogadjajiParams.sort);
    params = params.append('PageIndex', dogadjajiParams.pageNumber.toString());
    params = params.append('PageSize', dogadjajiParams.pageSize.toString());
    return this.http
      .get<Pagination>(this.baseUrl + 'dogadjaji', {
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
  getDogadjaj(id: number) {
    return this.http.get<Dogadjaj>(this.baseUrl + 'dogadjaji/' + id);
  }

  // tslint:disable-next-line: typedef
  getDogadjajiKategorije() {
    return this.http.get<DogadjajiKategorije[]>(
      this.baseUrl + 'Dogadjaji/DogadjajKategorije'
    );
  }
  // tslint:disable-next-line: typedef
  createDogadjaj(dogadjaj: DogadjajFormValues) {
    return this.http.post(this.baseUrl + 'dogadjaji', dogadjaj);
  }

  // tslint:disable-next-line: typedef
  updateDogadjaj(dogadjaj: DogadjajFormValues, id: number) {
    return this.http.put(this.baseUrl + 'dogadjaji/' + id, dogadjaj);
  }

  // tslint:disable-next-line: typedef
  deleteDogadjaj(id: number) {
    return this.http.delete(this.baseUrl + 'dogadjaji/' + id);
  }
}
