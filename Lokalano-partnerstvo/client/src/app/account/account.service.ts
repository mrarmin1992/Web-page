import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { ReplaySubject } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AdminPasswordReset } from '../shared/models/adminPasswordReset';
import { ForgotPasswordDto } from '../shared/models/ForgotPasswordDto';
import { LoggedResetPasswordDto } from '../shared/models/loggedResetPasswordDto';
import { Pagination } from '../shared/models/pagination';
import { ResetPasswordDto } from '../shared/models/resetPasswordDto';
import { IUser } from '../shared/models/user';
import { UsersParams } from '../shared/models/usersParams';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private currentUserSource = new BehaviorSubject<IUser>(null);
  currentUser$ = this.currentUserSource.asObservable();
  private isAdminSource = new ReplaySubject<boolean>(1);
  isAdmin$ = this.isAdminSource.asObservable();
  pagination = new Pagination();
  usersParams = new UsersParams();

  constructor(private http: HttpClient, private router: Router) { }


  // tslint:disable-next-line: typedef
  getUsers() {
    let params = new HttpParams();
    params = params.append('pageIndex', this.usersParams.pageNumber.toString());
    params = params.append('pageSize', this.usersParams.pageSize.toString());
    params = params.append('sort', this.usersParams.sort);
    if (this.usersParams.search) {
      params = params.append('search', this.usersParams.search);
    }

    return this.http.get<Pagination>(this.baseUrl + 'account/users', { observe: 'response', params })
      .pipe(
        map(response => {
          this.pagination = response.body;
          return this.pagination;
        })
      );
  }
  // tslint:disable-next-line: typedef
  setUsersParams(params: UsersParams) {
    this.usersParams = params;
  }

  // tslint:disable-next-line: typedef
  deleteUser(email: string) {
    return this.http.delete(this.baseUrl + 'account/' + email);
  }

  // tslint:disable-next-line: typedef
  getUsersParams() {
    return this.usersParams;
  }
  // tslint:disable-next-line: typedef
  register(values: any) {
    return this.http.post(this.baseUrl + 'account/register', values);
  }
  // tslint:disable-next-line: typedef
  login(values: any) {
    return this.http.post(this.baseUrl + 'account/login', values).pipe(
      map((user: IUser) => {
        if (user) {
          localStorage.setItem('token', user.token);
          this.currentUserSource.next(user);
          this.isAdminSource.next(this.isAdmin(user.token));
        }
      })
    );
  }
  // tslint:disable-next-line: typedef
  logout() {
    localStorage.removeItem('token');
    this.currentUserSource.next(null);
    this.router.navigateByUrl('/');

  }
  // tslint:disable-next-line: typedef
  getCurrentUserValue() {
    return this.currentUserSource.value;
  }

  // tslint:disable-next-line: typedef
  loadCurrentUser(token: string) {
    if (token === null) {
      this.currentUserSource.next(null);
      return of(null);
    }

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http.get(this.baseUrl + 'account', {headers}).pipe(
      map((user: IUser) => {
        if (user) {
          localStorage.setItem('token', user.token);
          this.currentUserSource.next(user);
          this.isAdminSource.next(this.isAdmin(user.token));
        }
      })
    );
  }

  // tslint:disable-next-line: typedef
  checkEmailExists(email: string) {
    return this.http.get(this.baseUrl + 'account/emailexists?email=' + email);
  }
  isAdmin(token: string): boolean {
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      if (decodedToken.role.indexOf('Admin') > -1) {
        return true;
      }
    }
  }
  adminPasswordReset(resetPassDto: AdminPasswordReset) {
    return this.http.post(this.baseUrl + 'account/changepassword-admin', resetPassDto);
  }

  public forgotPassword = (body: ForgotPasswordDto) => {
    return this.http.post(this.baseUrl + 'account/forgotpassword', body);
  }

  public loggedResetPassword = (body: LoggedResetPasswordDto) => {
    return this.http.post(this.baseUrl + 'account/loggedresetpassword', body);
  }

  logoutPasswordReset() {
    localStorage.removeItem('token');
    this.currentUserSource.next(null);
    this.router.navigateByUrl('account/login');
  }

  public resetPassword = (body: ResetPasswordDto) => {
    return this.http.post(this.baseUrl + 'account/resetpassword', body);
  }
}
