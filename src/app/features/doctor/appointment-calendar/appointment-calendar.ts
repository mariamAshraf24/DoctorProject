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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Appointments } from '../../../core/services/appointments';
import { Appointment } from '../../../core/models/IAppointment';
import { forkJoin, map } from 'rxjs';
import { formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

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
    MatDialogModule,
       MatFormFieldModule,
    MatInputModule,
    MatMenuModule
  ],
  providers: [DatePipe],
  templateUrl: './appointment-calendar.html',
  styleUrls: ['./appointment-calendar.scss'],
})

export class AppointmentCalendar implements OnInit {
  private appointmentsService = inject(Appointments);
  private router = inject(Router);
  public datePipe = inject(DatePipe);
  private dialog = inject(MatDialog);

  constructor() {
    this.maxDate.setMonth(this.maxDate.getMonth() + 1);
  }


  currentDate = new Date();
  selectedDate = new Date();
  appointments: Appointment[] = [];
  weekAppointments: { date: Date; apps: Appointment[] }[] = [];
  loading = false;
  weekDays: WeekDay[] = [];
  currentWeekStart: Date = new Date();
  error: string | null = null;
  showDelayForm: boolean = false;
  selectedDateForDelay: string = '';
  // delayDuration: string = '';
  selectedDayForAction: WeekDay | null = null;
  delayMinutesInput: number | null = null;
  selectedDayForDelay: string | null = null;
  delayInputVisible = false;
  delayDuration = '';


  minDate = new Date(2020, 0, 1);
  maxDate = new Date(2050, 11, 31);

  ngOnInit(): void {
    this.initializeWeek();
    this.loadAppointmentsForWeek();
    // this.loadAppointments();
  }

  initializeWeek(): void {
    // Set current week start to Monday of the current week
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
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

    for (let i = 0; i < 7; i++) {
      const date = new Date(this.currentWeekStart);
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
        console.log('Appointments loaded for week:', responses)
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
  openDayActionsModal(day: WeekDay): void {
    this.selectedDayForAction = day;
    this.delayMinutesInput = null;
  }

  openDelayInput(date: string) {
  this.selectedDayForDelay = date;
  this.delayDuration = '';
  this.delayInputVisible = true;
}
submitDelayDuration(): void {
  if (!this.delayDuration || isNaN(+this.delayDuration) || +this.delayDuration <= 0) {
    alert('❌ أدخل مدة تأخير صحيحة بالدقائق');
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
        const dayIndex = this.weekDays.findIndex(d => d.dateString === this.selectedDayForDelay);
        if (dayIndex !== -1) {
          this.appointmentsService.getAppointmentsByDate(this.selectedDayForDelay!)
            .subscribe(appointments => {
              this.weekDays[dayIndex].appointments = appointments.sort(
                (a: Appointment, b: Appointment) => a.startTime.localeCompare(b.startTime)
              );
            });
        }
        alert(`✅ ${res.message || 'تم التأجيل بنجاح'}`);
        this.delayInputVisible = false;
        this.selectedDayForDelay = null;
      },
      error: (error) => {
        const msg = error?.error?.message || '❌ فشل التأجيل';
        const details = error?.error?.errors?.join('\n') || '';
        alert(`${msg}\n${details}`);
      },
    });
}

// Add this to your AppointmentCalendar class
openAddAppointment(date: string, hour: number): void {
  // You can implement this to open a dialog for adding new appointments
  console.log(`Add appointment for ${date} at hour ${hour}`);
}

// getAppointmentsForHour(appointments: Appointment[], hour: number): Appointment[] {
//   return appointments.filter(app => {
//     // For "HH:mm:ss" format
//     const timeParts = app.startTime.split(':');
//     let appHour = parseInt(timeParts[0]);
    
//     // If format includes AM/PM (like "2:30:00 PM")
//     if (app.startTime.includes('PM') && appHour < 12) {
//       appHour += 12;
//     }
//     if (app.startTime.includes('AM') && appHour === 12) {
//       appHour = 0;
//     }
    
//     return appHour === hour;
//   });
// }
// getAppointmentsForHour(appointments: Appointment[], hour: number): Appointment[] {
//   return appointments.filter(app => {
//     // Extract hour from "HH:mm:ss" format
//     const appHour = parseInt(app.startTime.split(':')[0]);
//     return appHour === hour;
//   });
// }

// Update the getAppointmentsForHour method
getAppointmentsForHour(appointments: Appointment[], hour: number): Appointment[] {
  return appointments.filter(app => {
    const appHour = parseInt(app.startTime.split(':')[0]);
    return appHour === hour;
  });
}

// Add this method to format time slots
getTimeSlots(): { hour: number, label: string }[] {
  return [
    { hour: 0, label: '' },
    { hour: 1, label: '1 ص' },
    { hour: 2, label: '2 ص' },
    { hour: 3, label: '3 ص' },
    { hour: 4, label: '4 ص' },
    { hour: 5, label: '5 ص' },
    { hour: 6, label: '6 ص' },
    { hour: 7, label: '7 ص' },
    { hour: 8, label: '8 ص' },
    { hour: 9, label: '9 ص' },
    { hour: 10, label: '10 ص' },
    { hour: 11, label: '11 ص' },
    { hour: 12, label: '12 م' },
    { hour: 13, label: '1 م' },
    { hour: 14, label: '2 م' },
    { hour: 15, label: '3 م' },
    { hour: 16, label: '4 م' },
    { hour: 17, label: '5 م' },
    { hour: 18, label: '6 م' },
    { hour: 19, label: '7 م' },
    { hour: 20, label: '8 م' },
    { hour: 21, label: '9 م' },
    { hour: 22, label: '10 م' },
    { hour: 23, label: '11 م' }
  ];
}

formatTimeTo12Hour(time24: string): string {
  if (!time24) return '';
  
  const [hours, minutes] = time24.split(':');
  const hourNum = parseInt(hours, 10);
  
  if (hourNum >= 12) {
    const hour12 = hourNum === 12 ? 12 : hourNum - 12;
    return `${hour12.toString().padStart(2, '0')}`;
  } else {
    const hour12 = hourNum === 0 ? 12 : hourNum;
    return `${hour12.toString().padStart(2, '0')}`;
  }
}

  cancelAppointments(date: string): void {
    // const formattedDate = formatDate(date, 'yyyy-MM-dd', 'en-US');

    if (confirm(`هل أنت متأكد من إلغاء جميع مواعيد يوم ${date}؟`)) {
      this.appointmentsService.cancelAppointmentsByDate(date).subscribe({
        next: (res) => {
          const dayIndex = this.weekDays.findIndex(d => d.dateString === date);
        if (dayIndex !== -1) {
          this.weekDays[dayIndex].appointments = [];
        }
          alert('✅ تم إلغاء مواعيد هذا اليوم بنجاح');
          // يمكنك إعادة تحميل البيانات هنا إن أردت
        },
        error: (err) => {
          console.error(err);
          alert('❌ حدث خطأ أثناء محاولة الإلغاء');
        },
      });
    }
  }
  previousWeek(): void {
    const newDate = new Date(this.currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    this.currentWeekStart = newDate;
    this.generateWeekDays();
    this.loadAppointmentsForWeek();
  }

  nextWeek(): void {
    const newDate = new Date(this.currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    this.currentWeekStart = newDate;
    this.generateWeekDays();
    this.loadAppointmentsForWeek();
  }

  onDateSelected(date: Date): void {
    this.selectedDate = date;
    // Find the Monday of the selected week
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

  formatDateToApiString(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // two digits
    const day = date.getDate().toString().padStart(2, '0'); // two digits
    return `${year}-${month}-${day}`; // returns format like 2025-07-10
  }

  getStatusText(status: number): string {
    switch (status) {
      case 0:
        return 'مُؤكَّد';
      case 1:
        return 'مُؤجَّل';
      case 2:
        return 'مُكتمل';
      case 3:
        return 'ملغى';
      case 4:
        return 'لم يحضر';
      default:
        return '';
    }
  }
}
