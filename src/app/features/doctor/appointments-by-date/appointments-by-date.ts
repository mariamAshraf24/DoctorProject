import { Component, OnInit } from '@angular/core';
import { Appointment } from '../../../core/models/IAppointment';
import { ActivatedRoute } from '@angular/router';
import { Appointments } from '../../../core/services/appointments';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-appointments-by-date',
  imports: [CommonModule],
  providers: [DatePipe],
  templateUrl: './appointments-by-date.html',
  styleUrl: './appointments-by-date.scss',
})
export class AppointmentsByDate implements OnInit {
  appointments: Appointment[] = [];
  selectedDate: string = '';
  isLoading: boolean = false;
  error: string | null = null;

  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _appointmentService: Appointments,
    private _DatePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe((params) => {
      const dateParam = params.get('date');
      if (dateParam) {
        this.selectedDate = dateParam;
        this.loadAppointments(dateParam);
      }
    });
  }

  loadAppointments(dateString: string): void {
    this.isLoading = true;
    this.error = null;

    const dateParts = dateString.split('-');
    const date = new Date(
      parseInt(dateParts[0]),
      parseInt(dateParts[1]) - 1,
      parseInt(dateParts[2])
    );
    // this._appointmentService.getAppointmentsByDate(date).subscribe({
    //   next: (appointments) => {
    //     this.appointments = appointments;
    //     this.isLoading = false;
    //   },
    //   error: (err) => {
    //     this.error = 'Failed to load appointments. Please try again later.';
    //     this.isLoading = false;
    //     console.error(err);
    //   },
    // });
  }

  getFormattedDate(): string {
    if (!this.selectedDate) return '';
    const dateParts = this.selectedDate.split('-');
    const date = new Date(
      parseInt(dateParts[0]),
      parseInt(dateParts[1]) - 1,
      parseInt(dateParts[2])
    );
    return this._DatePipe.transform(date, 'fullDate') || '';
  }

  goBack(): void {
    window.history.back();
  }

  getAppointmentType(type: number): string {
    switch (type) {
      case 0:
        return 'Consultation';
      case 1:
        return 'Follow-up';
      case 2:
        return 'Check-up';
      default:
        return 'Unknown';
    }
  }

  getAppointmentStatus(status: number): string {
    switch (status) {
      case 0:
        return 'Scheduled';
      case 1:
        return 'Completed';
      case 2:
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  }
}
