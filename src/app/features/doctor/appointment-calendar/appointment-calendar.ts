import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Router, RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Appointments } from '../../../core/services/appointments';
import { Appointment } from '../../../core/models/IAppointment';
import { forkJoin } from 'rxjs';
import { FormsModule } from '@angular/forms';

interface WeekDay {
  date: Date;
  dayName: string;
  dateString: string;
  appointments: Appointment[];
}

@Component({
  selector: 'app-appointment-calendar',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    RouterModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [DatePipe],
  templateUrl: './appointment-calendar.html',
  styleUrls: ['./appointment-calendar.scss'],
})
export class AppointmentCalendar implements OnInit {
  private appointmentsService = inject(Appointments);
  private router = inject(Router);
  public datePipe = inject(DatePipe);

  currentDate = new Date();
  selectedDate = new Date();
  weekDays: WeekDay[] = [];
  currentWeekStart = new Date();
  loading = false;
  error: string | null = null;

  // Modal states
  delayInputVisible = false;
  cancelConfirmVisible = false;
  selectedDayForDelay: string | null = null;
  delayDuration = '';
  selectedDayForCancel = '';

  // Add these near your other state variables
modalMessage = '';
modalType: 'success' | 'error' | 'info' = 'info';
showModal = false;

  minDate = new Date(2020, 0, 1);
  maxDate = new Date(3050, 11, 31);

  ngOnInit(): void {
    this.initializeWeek();
    this.loadAppointmentsForWeek();
  }

  initializeWeek(): void {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    this.currentWeekStart = new Date(today.setDate(diff));
    this.generateWeekDays();
  }

  generateWeekDays(): void {
    this.weekDays = [];
    const daysOfWeek = [
      'السبت',
      'الأحد',
      'الإثنين',
      'الثلاثاء',
      'الأربعاء',
      'الخميس',
      'الجمعة',
    ];

    const startDate = new Date(this.currentWeekStart);
    const day = startDate.getDay();
    const diffToSaturday = (day + 1) % 7;
    startDate.setDate(startDate.getDate() - diffToSaturday);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);

      this.weekDays.push({
        date: date,
        dayName: daysOfWeek[i],
        dateString: this.formatDateToApiString(date),
        appointments: [],
      });
    }
  }

  loadAppointmentsForWeek(): void {
    this.loading = true;
    this.error = null;

    forkJoin(
      this.weekDays.map((day) =>
        this.appointmentsService.getAppointmentsByDate(day.dateString)
      )
    ).subscribe({
      next: (responses) => {
        responses.forEach((appointments, index) => {
          this.weekDays[index].appointments = appointments.sort(
            (a: Appointment, b: Appointment) =>
              a.startTime.localeCompare(b.startTime)
          );
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'حدث خطأ أثناء تحميل المواعيد';
        this.loading = false;
        console.error(err);
      },
    });
  }

  formatDateToApiString(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  previousWeek(): void {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7);
    this.generateWeekDays();
    this.loadAppointmentsForWeek();
  }

  nextWeek(): void {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 7);
    this.generateWeekDays();
    this.loadAppointmentsForWeek();
  }

  onDateSelected(date: Date): void {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    this.currentWeekStart = new Date(date.setDate(diff));
    this.generateWeekDays();
    this.loadAppointmentsForWeek();
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  get currentWeekRange(): string {
    const start = new Date(this.currentWeekStart);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);

    return `${this.datePipe.transform(
      start,
      'd MMM'
    )} - ${this.datePipe.transform(end, 'd MMM y')}`;
  }

  getStatusText(status: number): string {
    switch (status) {
      case 0: return 'مُؤكَّد';
      case 1: return 'مُؤجَّل';
      case 2: return 'مُكتمل';
      case 3: return 'ملغى';
      case 4: return 'لم يحضر';
      default: return '';
    }
  }

  private showMessageModal(message: string, type: 'success' | 'error' | 'info' = 'info') {
  this.modalMessage = message;
  this.modalType = type;
  this.showModal = true;
}

 closeMessageModal() {
  this.showModal = false;
}

  openDelayInput(date: string): void {
    this.selectedDayForDelay = date;
    this.delayDuration = '';
    this.delayInputVisible = true;
  }

  // submitDelayDuration(): void {
  //   if (!this.delayDuration || isNaN(+this.delayDuration) || +this.delayDuration <= 0) {
  //     alert('❌ أدخل مدة تأخير صحيحة بالدقائق');
  //     return;
  //   }

  //   const minutes = +this.delayDuration;
  //   const hours = Math.floor(minutes / 60).toString().padStart(2, '0');
  //   const mins = (minutes % 60).toString().padStart(2, '0');
  //   const formatted = `${hours}:${mins}:00`;

  //   this.appointmentsService
  //     .delayAppointmentsByDate(this.selectedDayForDelay!, formatted)
  //     .subscribe({
  //       next: (res: any) => {
  //         const dayIndex = this.weekDays.findIndex(
  //           (d) => d.dateString === this.selectedDayForDelay
  //         );
  //         if (dayIndex !== -1) {
  //           this.appointmentsService
  //             .getAppointmentsByDate(this.selectedDayForDelay!)
  //             .subscribe((appointments) => {
  //               this.weekDays[dayIndex].appointments = appointments.sort(
  //                 (a: Appointment, b: Appointment) =>
  //                   a.startTime.localeCompare(b.startTime)
  //               );
  //             });
  //         }
  //         this.delayInputVisible = false;
  //         alert(`✅ ${res.message || 'تم التأجيل بنجاح'}`);
  //       },
  //       error: (error) => {
  //         const msg = error?.error?.message || '❌ فشل التأجيل';
  //         const details = error?.error?.errors?.join('\n') || '';
  //         alert(`${msg}\n${details}`);
  //       },
  //     });
  // }

  submitDelayDuration(): void {
  if (!this.delayDuration || isNaN(+this.delayDuration) || +this.delayDuration <= 0) {
    this.showMessageModal('أدخل مدة تأخير صحيحة بالدقائق', 'error');
    return;
  }

  const minutes = +this.delayDuration;
  const hours = Math.floor(minutes / 60).toString().padStart(2, '0');
  const mins = (minutes % 60).toString().padStart(2, '0');
  const formatted = `${hours}:${mins}:00`;

  this.appointmentsService
    .delayAppointmentsByDate(this.selectedDayForDelay!, formatted)
    .subscribe({
      next: (res: any) => {
        const dayIndex = this.weekDays.findIndex(
          (d) => d.dateString === this.selectedDayForDelay
        );
        if (dayIndex !== -1) {
          this.appointmentsService
            .getAppointmentsByDate(this.selectedDayForDelay!)
            .subscribe((appointments) => {
              this.weekDays[dayIndex].appointments = appointments.sort(
                (a: Appointment, b: Appointment) =>
                  a.startTime.localeCompare(b.startTime)
              );
            });
        }
        this.delayInputVisible = false;
        this.showMessageModal(res.message || 'تم التأجيل بنجاح', 'success');
      },
      error: (error) => {
  let errorMessage = 'فشل في تأجيل المواعيد';
  
  if (error?.error?.message?.includes('Failed to delay appointments.')) {
    errorMessage = 'تم تأجيل اليوم من قبل';
  } else if (error?.error?.errors) {
    errorMessage += `\n${error.error.errors.join('\n')}`;
  }
  console.error(error);
  this.showMessageModal(errorMessage, 'error');
},
    });
}

  openCancelModal(dateString: string): void {
    this.selectedDayForCancel = dateString;
    this.cancelConfirmVisible = true;
  }

  // confirmCancel(): void {
  //   this.appointmentsService.cancelAppointmentsByDate(this.selectedDayForCancel).subscribe({
  //     next: () => {
  //       const day = this.weekDays.find(d => d.dateString === this.selectedDayForCancel);
  //       if (day) day.appointments = [];
  //       this.cancelConfirmVisible = false;
  //       alert('✅ تم إلغاء المواعيد بنجاح');
  //     },
  //     error: () => {
  //       alert('❌ فشل الإلغاء');
  //     },
  //   });
  // }

  confirmCancel(): void {
  this.appointmentsService.cancelAppointmentsByDate(this.selectedDayForCancel).subscribe({
    next: () => {
      const day = this.weekDays.find(d => d.dateString === this.selectedDayForCancel);
      if (day) day.appointments = [];
      this.cancelConfirmVisible = false;
      this.showMessageModal('تم إلغاء المواعيد بنجاح', 'success');
    },
    error: () => {
      this.showMessageModal('فشل الإلغاء', 'error');
    },
  });
}
}