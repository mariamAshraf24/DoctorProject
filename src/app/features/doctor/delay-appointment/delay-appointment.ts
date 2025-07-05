import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Appointments } from '../../../core/services/appointments';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-delay-appointment',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './delay-appointment.html',
  styleUrl: './delay-appointment.scss'
})
export class DelayAppointment {
  delayForm: FormGroup;
  isLoading = false;
  message: string | null = null;


  constructor(private fb: FormBuilder, private appointmentService: Appointments) {
    this.delayForm = this.fb.group({
      date: [null, Validators.required],
      delayDuration: ['01:00:00', Validators.required] // قيمة افتراضية ساعة واحدة
    });
  }

  onDelaySubmit(): void {
    if (this.delayForm.invalid) {
      this.delayForm.markAllAsTouched();
      return;
    }

    const { date, delayDuration } = this.delayForm.value;
    this.isLoading = true;
    this.message = null;

    this.appointmentService.delayAppointmentsByDate(date, delayDuration).subscribe({
      next: (res: any) => {
        this.message = res?.message || 'تم تأجيل المواعيد بنجاح ✅';
        this.isLoading = false;
        this.delayForm.reset({ delayDuration: '01:00:00' });
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.message = 'حدث خطأ أثناء تأجيل المواعيد ❌';
        this.isLoading = false;
      }
    });
  }
}
