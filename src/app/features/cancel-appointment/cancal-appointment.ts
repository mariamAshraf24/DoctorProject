import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Appointments } from '../../core/services/appointments';
import { HttpErrorResponse } from '@angular/common/http';
import { NgClass, CommonModule } from '@angular/common';

@Component({
  selector: 'app-cancal-appointment',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule, CommonModule],
  templateUrl: './cancal-appointment.html',
  styleUrl: './cancal-appointment.scss'
})
export class CancalAppointment {
  cancelForm: FormGroup;
  isLoading = false;
  message: string | null = null;

  constructor(private fb: FormBuilder, private _appointmentService: Appointments) {
    this.cancelForm = this.fb.group({
      date: [null, Validators.required]
    });
  }

  onCancelSubmit(): void {
    if (this.cancelForm.invalid) {
      this.cancelForm.markAllAsTouched();
      return;
    }

    const selectedDate: string = this.cancelForm.value.date;

    // ✅ نحول التاريخ إلى صيغة yyyy-MM-dd المطلوبة للـ .NET API
    const formattedDate = new Date(selectedDate).toISOString().split('T')[0];

    this.isLoading = true;
    this.message = null;

    this._appointmentService.cancelAppointmentsByDate(formattedDate).subscribe({
      next: (res: any) => {
        this.message = res?.message || 'تم إلغاء جميع المواعيد بنجاح ✅';
        this.isLoading = false;
        this.cancelForm.reset();
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.message = 'فشل في إلغاء المواعيد ❌';
        this.isLoading = false;
      }
    });
  }
}
