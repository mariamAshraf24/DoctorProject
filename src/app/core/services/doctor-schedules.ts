import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { inject } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DoctorSchedulesService {
  constructor(private _httpclient:HttpClient) { }


  getAllSchedules(): Observable<any> {  
      return this._httpclient.get(`${environment.apiBaseUrl}/DoctorSchedules/AllSchedules`);
  }


  // getScheduleById(id: string): Observable<any> {
  //     return this._httpclient.get(`${environment.apiBaseUrl}/DoctorSchedules/${id}`);
  // }


  getScheduleByDoctorIdAndDate(doctorId: string | null , date:any): Observable<any> {
      console.log('Calling API with:', { doctorId, date });
      // استخدام الـ endpoint الصحيح مباشرة
      return this._httpclient.get(`${environment.apiBaseUrl}/DoctorSchedules/${doctorId}/slots?date=${date}`);
  }
  //slots?date=

  addSchedule(data: any): Observable<any> {
    return this._httpclient.post(`${environment.apiBaseUrl}/DoctorSchedules/AddSchedule`, data);
  }

   

  deleteSchedule(id: string): Observable<any> {
    return this._httpclient.delete(`${environment.apiBaseUrl}/DoctorSchedules/${id}`);
  }
}
