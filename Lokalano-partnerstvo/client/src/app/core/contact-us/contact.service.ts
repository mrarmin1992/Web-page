import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contact } from 'src/app/shared/models/contact';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // tslint:disable-next-line: typedef
  getMessage(contact: Contact) {
    return this.http.post(this.baseUrl + 'contact', contact);
  }
}
