import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Appointment } from '../models/IAppointment';

@Injectable({
  providedIn: 'root',
})
export class Appointments {
  constructor(private _HttpClient: HttpClient) {}
  getTodayAppointments(): Observable<any> {
    return this._HttpClient.get<any[]>(
      `${environment.apiBaseUrl}/Doctor/TodayAppointments`
    );
  }

 getAppointmentsByDate(date: string, status?: number): Observable<Appointment[]> {
  let url = `${environment.apiBaseUrl}/Doctor/AppointmentsByDate?date=${date}`;
  
  if (status !== undefined && status !== null) {
    url += `&appointmentState=${status}`;
  }

  return this._HttpClient.get<Appointment[]>(url);
}

  cancelAppointmentsByDate(date: string) {
  return this._HttpClient.post(
    `${environment.apiBaseUrl}/Appointment/cancelAppointments`,
    `"${date}"`,
    {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'text' as 'json'
    }
  );
}

  delayAppointmentsByDate(date: string, delayDuration: string): Observable<any> {
  const body = {
    date,
    delayDuration
  };
  
  return this._HttpClient.post(
    `${environment.apiBaseUrl}/Appointment/delayAppointmes`,
    body,
    { headers: { 'Content-Type': 'application/json' } }
  );
  
}
}
