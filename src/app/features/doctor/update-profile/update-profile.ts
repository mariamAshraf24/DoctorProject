import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../../../core/services/doctor-service';
import { Specialization } from '../../../core/models/ISpecialization';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './update-profile.html',
  styleUrl: './update-profile.scss',
})
export class UpdateProfile implements OnInit {
  editForm!: FormGroup;
  specializations: Specialization[] = [];
  error: string = '';

  constructor(
    private _DoctorService: DoctorService,
    private _FormBuilder: FormBuilder,
    public _Router: Router
  ) {}

  ngOnInit(): void {
    this.editForm = this._FormBuilder.group({
      fName: [
        null,
        [Validators.required, Validators.pattern(/^[\u0600-\u06FFa-zA-Z ]+$/)],
      ],
      lName: [
        null,
        [Validators.required, Validators.pattern(/^[\u0600-\u06FFa-zA-Z ]+$/)],
      ],
      city: ['', Validators.required],
      street: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[\u0600-\u06FFa-zA-Z0-9\s\-]*$/),
        ],
      ],
      country: ['مصر'],
      bookingPrice: [null, Validators.required],
      specializationId: [null, Validators.required],
    });

    this.loadProfileAndSpecializations();
  }

  loadProfileAndSpecializations(): void {
    this._DoctorService.getDoctorProfile().subscribe({
      next: (profile) => {
        console.log(profile);
        this.editForm.patchValue(profile.data);
      },
      error: () => {
        this.error = 'تعذر تحميل بيانات الطبيب';
      }
    });

    this._DoctorService.getSpecializations().subscribe({
      next: (res) => (this.specializations = res.data),
      error: () => (this.error = 'تعذر تحميل التخصصات')
    });
  }

  onSubmit(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this._DoctorService.updateDoctorProfile(this.editForm.value).subscribe({
      next: () => {
        alert('تم تحديث البيانات بنجاح');
        this._Router.navigate(['/doctor/profile']);
      },
      error: () => alert('حدث خطأ أثناء تحديث البيانات')
    });
  }
}
