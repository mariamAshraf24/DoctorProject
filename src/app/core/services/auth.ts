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

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }
  
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  forgotPassword(email: string) {
    return this._HttpClient.post(`${environment.apiBaseUrl}/Auth/forgot-password`, { email },{ responseType: 'text' as 'json' });
  
  }

  resetPassword(data: { token: string; newPassword: string }) {
    return this._HttpClient.post(`${environment.apiBaseUrl}/Auth/reset-password`, data,{ responseType: 'text' as 'json' });
  }

  isAdmin(): boolean {
    return localStorage.getItem('roles') === 'Admin';
  }

  isDoctor(): boolean {
    return localStorage.getItem('roles') === 'Doctor';
  }


  //extract doctorid from token
  getDoctorIdFromToken(): string {
  const token = this.getToken();
  if (!token) return '';

  try {
    const payload = token.split('.')[1]; 
    const decodedPayload = JSON.parse(atob(payload));
    return decodedPayload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || '';
  } catch (e) {
    console.error('Error decoding token:', e);
    return '';
  }
}

getCurrentDoctorId(): string {
  return localStorage.getItem('doctorId') || '';
}


}
