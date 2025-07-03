import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Appointments } from '../../../core/services/appointments';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  providers: [DatePipe],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss',
})
export class Calendar implements OnInit {
  days: { date: Date; hasAppointments: boolean }[] = [];
  isLoading: boolean = true;

  constructor(
    private _Router: Router,
    private _DatePipe: DatePipe,
    private _AppointmentsService: Appointments
  ) {}

  async ngOnInit(): Promise<void> {
    await this.generateDays();
    this.isLoading = false;
  }

  async generateDays(): Promise<void> {
    const today = new Date();
    this.days = [];

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const dateString = this.getFormattedRouteDate(date);
      const appointments = await this._AppointmentsService
        .getAppointmentsByDate(date)
        .toPromise();

      this.days.push({
        date,
        hasAppointments: appointments ? appointments.length > 0 : false,
      });
    }
  }

  getArabicDayName(date: Date): string {
    const arabicDays = [
      'الأحد',
      'الإثنين',
      'الثلاثاء',
      'الأربعاء',
      'الخميس',
      'الجمعة',
      'السبت',
    ];
    return arabicDays[date.getDay()];
  }

  getArabicDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    return new Intl.DateTimeFormat('ar-EG', options).format(date);
  }

  getFormattedRouteDate(date: Date): string {
    // Format as YYYY-MM-DD
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }

  onDateClick(date: Date): void {
    const dateString = this.getFormattedRouteDate(date);
    this._Router.navigate(['/AppointmentsByDate', dateString]);
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }
}
