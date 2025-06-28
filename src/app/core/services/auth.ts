import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  constructor(private _HttpClient : HttpClient) { }

  register(data: any): Observable<any> {
    return this._HttpClient.post(`${environment.apiBaseUrl}/Auth/register`,data);
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }
  
}
