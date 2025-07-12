import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Appointments } from '../../../core/services/appointments';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Appointment } from '../../../core/models/IAppointment';

@Component({
  selector: 'app-today-appointments',
  imports: [CommonModule, MatDatepickerModule ,  MatCardModule,
    MatButtonModule,
    MatNativeDateModule,
    MatIconModule
  ],
  providers: [DatePipe],
  templateUrl: './today-appointments.html',
  styleUrl: './today-appointments.scss',
  
})
export class TodayAppointments implements OnInit {
  private readonly _Appointments = inject(Appointments);
  private readonly _Router = inject(Router);
  private readonly _DatePipe = inject(DatePipe);

// Today's appointments data
  appointments: Appointment[] = [];
  loading = true;
  error: string | null = null;
  selected: any = null;

  // Calendar data
  selectedDate: Date = new Date();
  minDate: Date = new Date(2020, 0, 1);
  maxDate: Date = new Date(2050, 11, 31);
  today: Date = new Date();

  ngOnInit(): void {
    this.loadTodayAppointments();
  }

  loadTodayAppointments(): void {
    this._Appointments.getTodayAppointments().subscribe({
      next: (data) => {
        const todayStr = this._DatePipe.transform(this.today, 'yyyy-MM-dd');
        this.appointments = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'فشل تحميل المواعيد';
        this.loading = false;
      }
    });
  }


  isToday(date: Date): boolean {
    return date.getDate() === this.today.getDate() &&
           date.getMonth() === this.today.getMonth() &&
           date.getFullYear() === this.today.getFullYear();
  }

  // ngOnInit(): void {
  //   this._Appointments.getTodayAppointments().subscribe({
  //     next: (data) => {
  //       console.log('API response:', data);
  //       this.appointments = data;
  //       this.loading = false;
  //     },
  //     error: () => {
  //       this.error = 'فشل تحميل المواعيد';
  //       this.loading = false;
  //     }
  //   });
  // }

  onDateSelected(date: Date | null): void {
    if (!date) return;
    this.selectedDate = date;
    if (this.isToday(date)) {
      this.loadTodayAppointments();
    } else {
      const dateString = this._DatePipe.transform(date, 'yyyy-MM-dd') || '';
      this._Router.navigate(['/doctor/AppointmentsByDate', dateString]);
    }
  }


  // isSameDay(date1: Date, date2: Date): boolean {
  //   return date1.getFullYear() === date2.getFullYear() &&
  //          date1.getMonth() === date2.getMonth() &&
  //          date1.getDate() === date2.getDate();
  // }

  formatTime(time: string): string {
    const [h, m] = time.split(':');
    const hour = +h;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${m} ${ampm}`;
  }
}
