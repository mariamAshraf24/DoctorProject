import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'; // Adjust the path as necessary

@Injectable({
  providedIn: 'root'
})
export class Admin {

  private readonly _httpClient = inject(HttpClient);
  // constructor() { }


  getAllSpecializations(): Observable<any> {
    return this._httpClient.get(`${environment.apiBaseUrl}/Specializations`);
  }

  getSpecializationsById(id: string): Observable<any> {
    return this._httpClient.get(`${environment.apiBaseUrl}/Specializations/${id}`);
  }


  // getSpecializationsAndDoctorsById(id:string): Observable<any> {
  //   return this._httpClient.get(`${environment.apiBaseUrl}/Specializations/${id}/doctors`);
  // }


  addSpecialization(name: string): Observable<any> {
    return this._httpClient.post(`${environment.apiBaseUrl}/Specializations`, { name });
  }
  updateSpecialization(id: string , name: string): Observable<any> {
    return this._httpClient.put(`${environment.apiBaseUrl}/Specializations/${id}`,
      {

         id,
         name
      });
  }
  deleteSpecialization(id: string): Observable<any> {
    return this._httpClient.delete(`${environment.apiBaseUrl}/Specializations/${id}`);
  }
}
