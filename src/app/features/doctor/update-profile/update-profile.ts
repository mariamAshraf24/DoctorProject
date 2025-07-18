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
  imageUrl: string = '';
  error: string = '';
  loading: boolean = false;
  successMessage: string = '';

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
      country: [''],
      bookingPrice: [null, Validators.required],
    });
     this.loadDoctorData();
  }

  loadDoctorData(): void {
    this._DoctorService.getDoctorProfile().subscribe({
      next: (res) => {
        const data = res.data;
        this.editForm.patchValue({
          fName: data.fName,
          lName: data.lName,
          city: data.city,
          street: data.street,
          country: data.country,
          bookingPrice: data.bookingPrice
        });
        this.imageUrl = data.imageUrl;
        this.loading = false;
      },
      error: () => {
        // alert('❌ حدث خطأ أثناء تحميل البيانات');
        this.error = 'حدث خطأ أثناء تحميل البيانات';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';
    this.successMessage = '';

    const updatedData = {
      ...this.editForm.value,
      imageUrl: this.imageUrl
    };

    this._DoctorService.updateDoctorProfile(updatedData).subscribe({
      next: () => {
        this.successMessage = 'تم تحديث البيانات بنجاح';
        this.loading = false;

       setTimeout(() => {
          this._Router.navigate(['/doctor/profile']);
        }, 2000);
      },
      error: (err) => 
        {
        this.error = err.message || 'حدث خطأ أثناء تحديث البيانات';
        this.loading = false;
      }
    });
  }
}
