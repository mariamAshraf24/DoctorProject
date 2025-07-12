import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { DoctorProfileResponse } from '../models/IDoctor';
import { environment } from '../../../environments/environment';
import { SpecializationResponse } from '../models/ISpecialization';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  constructor(private _HttpClient: HttpClient) {}

  getDoctorProfile(): Observable<DoctorProfileResponse> {
    return this._HttpClient.get<DoctorProfileResponse>(
      `${environment.apiBaseUrl}/Doctor/doctor-profile`
    );
  }

  getSpecializations(): Observable<SpecializationResponse> {
    return this._HttpClient
      .get<SpecializationResponse>(`${environment.apiBaseUrl}/Specializations`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 0) {
            throw new Error(
              'Network error - please check your connection and try again.'
            );
          } else {
            throw new Error(
              `Server returned error: ${error.status} ${error.message}`
            );
          }
        })
      );
  }

  updateDoctorProfile(data: any): Observable<any> {
    return this._HttpClient.put(
      `${environment.apiBaseUrl}/Doctor/edit-doctor-profile`,
      data
    );
  }
  
}
