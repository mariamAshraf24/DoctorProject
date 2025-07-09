import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Appointments } from '../../../core/services/appointments';

@Component({
  selector: 'app-today-appointments',
  imports: [CommonModule],
  templateUrl: './today-appointments.html',
  styleUrl: './today-appointments.scss'
})
export class TodayAppointments implements OnInit {
  private readonly _Appointments = inject(Appointments);
  appointments: any[] = [];
  loading = true;
  error: string | null = null;
  selected: any = null;
  ngOnInit(): void {
    this._Appointments.getTodayAppointments().subscribe({
      next: (data) => {
        console.log('API response:', data);
        this.appointments = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'فشل تحميل المواعيد';
        this.loading = false;
      }
    });
  }

  formatTime(time: string): string {
    const [h, m] = time.split(':');
    const hour = +h;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${m} ${ampm}`;
  }
}
