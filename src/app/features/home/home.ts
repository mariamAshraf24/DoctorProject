// import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Appointments } from '../../core/services/appointments';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {
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
