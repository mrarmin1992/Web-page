import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  // tslint:disable-next-line: typedef
  uploadImage(file: File, id: number, vrsta: string) {
    const formData = new FormData();
    formData.append('photo', file, 'image.png');
    return this.http.put(this.baseUrl + vrsta + '/' + id + '/photo', formData, {
      reportProgress: true,
      observe: 'events'
    });
  }
  // tslint:disable-next-line: typedef
  uploadFile(file: File, id: number, vrsta: string) {
    console.log(file);
    const formData = new FormData();
    formData.append('fajl', file, file.name);
    return this.http.put(this.baseUrl + vrsta + '/' + id + '/file', formData, {
      reportProgress: true,
      observe: 'events'
    });
  }
  // tslint:disable-next-line: typedef
  deleteProductPhoto(productId: number) {
    return this.http.delete(this.baseUrl + 'vijesti/' + productId + '/photo');
  }

  // tslint:disable-next-line: typedef
  DeleteProductPhoto(productId: number) {
    return this.http.delete(this.baseUrl + 'kursevi/' + productId + '/photo');
  }

}
