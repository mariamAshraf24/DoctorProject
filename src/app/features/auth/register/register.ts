import {
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Auth } from './../../../core/services/auth';
import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  registerForm!: FormGroup;
  selectedImage: File | null = null;


  constructor(
    private _formBuilder: FormBuilder,
    private _authService: Auth,
    private _router: Router
  ) {}

  // ngOnInit(): void {
  //   this.registerForm = this._formBuilder.group({
  //     name: [
  //       null,
  //       [Validators.required, Validators.pattern(/^[\u0600-\u06FFa-zA-Z ]+$/)],
  //     ],
  //     email: [null, [Validators.required, Validators.email]],
  //     password: [
  //       null,
  //       [
  //         Validators.required,
  //         Validators.minLength(8),
  //         Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/),
  //       ],
  //     ],
  //     role: ['Doctor'],
  //     address: ['', Validators.required],
  //     dateOfBirth: [null, [Validators.required]],
  //     gender: [null, Validators.required],
  //     phone: [
  //       '',
  //       [
  //         Validators.required,
  //         Validators.pattern(/^(010|011|012|015)[0-9]{8}$/),
  //       ],
  //     ],
  //     licenceNumber: [null, Validators.required],
  //     specializationId: [null, Validators.required],
  //     bookingPrice: [null, Validators.required],
  //     imageUrl: [null, Validators.required],
  //   });
  // }

  ngOnInit(): void {
  this.registerForm = this._formBuilder.group({
    Email: [null, [Validators.required, Validators.email]],
    Password: [
      null,
      [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/),
      ],
    ],
    Role: ['Doctor'],
    userName:[null,Validators.required],
    FName: [
      null,
      [Validators.required, Validators.pattern(/^[\u0600-\u06FFa-zA-Z ]+$/)],
    ],
    LName: [
      null,
      [Validators.required, Validators.pattern(/^[\u0600-\u06FFa-zA-Z ]+$/)],
    ],
    City: ['', Validators.required],
    Street: ['', Validators.required],
    Country: ['', Validators.required],
    DateOfBirth: [null, [Validators.required]],
    gender: [null, Validators.required],
    Phone: [
      '',
      [
        Validators.required,
        Validators.pattern(/^(010|011|012|015)[0-9]{8}$/),
      ],
    ],
    LicenceNumber: [null, Validators.required],
    SpecializationId: [null, Validators.required],
    BookingPrice: [null, Validators.required],
    ImageFile: [null, Validators.required]
  });
}

  registerSubmit(): void {
    if (this.registerForm.invalid || !this.selectedImage ) {
      this.registerForm.markAllAsTouched();
      return;
    }
    const formData = new FormData();

    // Append all form values
    Object.keys(this.registerForm.value).forEach(key => {
      if (key !== 'ImageFile' && this.registerForm.value[key] !== null) {
        formData.append(key, this.registerForm.value[key]);
      }
    });
    
    if (this.registerForm.value.DateOfBirth) {
      const date = new Date(this.registerForm.value.DateOfBirth);
      if (!isNaN(date.getTime())) { // Check if valid date
        formData.set('DateOfBirth', date.toISOString());
      }
    }

    // Append the image file
    if (this.selectedImage) {
      formData.append('ImageFile', this.selectedImage);
    }

    // const formData = this.registerForm.value;
    this._authService.register(formData).subscribe({
      next: (res: any) => {
        if (res.isSuccess && res.token) {
          this._authService.saveToken(res.token);
          this.registerForm.reset();
          this._router.navigate(['/home']);
        } else {
          alert('حدث خطأ أثناء التسجيل');
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        alert('حدث خطأ أثناء التسجيل');
      },
    });
  }

  onImageSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.selectedImage = input.files[0];
    this.registerForm.patchValue({
      ImageFile: this.selectedImage.name
    });
  }
}
}
