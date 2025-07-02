import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Doctor {

  constructor(private _HttpClient:HttpClient) { }


  getProfile(): Observable<{ data: Doctor }> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this._HttpClient.get<{ data: Doctor }>(
      `${environment.apiBaseUrl}/Doctor/doctor-profile`,
      { headers }
    );
  }

}
