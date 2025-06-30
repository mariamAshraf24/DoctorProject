import { Login } from './../../features/auth/login/login';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  constructor(private _HttpClient: HttpClient) { }

  register(data: any): Observable<any> {
    return this._HttpClient.post(`${environment.apiBaseUrl}/Auth/register`, data);
  }

  login(data: any): Observable<any> {
    return this._HttpClient.post(`${environment.apiBaseUrl}/Auth/login`, data);
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }
  // setEmailVerify(data: object): Observable<any> {
  //   return this._HttpClient.post(`${environment.apiBaseUrl}/Auth/forgot-password`, data)
  // }
  //  setCodeVerify(data:object):Observable<any>{
  //   return this._HttpClient.post(`${environment.apiBaseUrl}/Auth/forgot-password`,data)
  // }

  // setRestPassword(data: object): Observable<any> {
  //   return this._HttpClient.post(`${environment.apiBaseUrl}/Auth/reset-password`, data)
  // }

  forgotPassword(data: { email: string }) {
    return this._HttpClient.post(`${environment.apiBaseUrl}/Auth/forgot-password`, data);
  }

  resetPassword(data: { email: string; resetCode: string; password: string }) {
    return this._HttpClient.post(`${environment.apiBaseUrl}/Auth/reset-password`, data);
  }

  isAdmin(): boolean {
    return localStorage.getItem('roles') === 'Admin';
  }

  isDoctor(): boolean {
    return localStorage.getItem('roles') === 'Doctor';
  }

}
