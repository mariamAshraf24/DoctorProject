import { FirebaseMessaging } from './../../../core/services/firebase-messaging';
import { DoctorService } from './../../../core/services/doctor-service';
import {
  Specialization,
  SpecializationResponse,
} from '../../../core/models/ISpecialization';
import {
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Auth } from './../../../core/services/auth';
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router , RouterModule} from '@angular/router';
import { cities } from '../../../core/constants/cities';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, NgSelectModule , RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register implements OnInit {
  registerForm!: FormGroup;
  selectedImage: File | null = null;
  usernameError: string = '';
  Cities = cities;
  Specializations: Specialization[] = [];

  constructor(
    private _formBuilder: FormBuilder,
    private _authService: Auth,
    private _router: Router,
    private _DoctorService: DoctorService,
    private _FirebaseMessaging: FirebaseMessaging
  ) {}

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
      userName: [
        null,
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z\u0600-\u06FF0-9]*$/),
        ],
      ],
      FName: [
        null,
        [Validators.required, Validators.pattern(/^[\u0600-\u06FFa-zA-Z ]+$/)],
      ],
      LName: [
        null,
        [Validators.required, Validators.pattern(/^[\u0600-\u06FFa-zA-Z ]+$/)],
      ],
      City: ['', Validators.required],
      Street: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[\u0600-\u06FFa-zA-Z0-9\s\-]*$/),
        ],
      ],
      Country: ['مصر'],
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
      ImageFile: [null, Validators.required],
    });
    this.loadSpecializations();
  }

  loadSpecializations(): void {
    this._DoctorService.getSpecializations().subscribe({
      next: (response: SpecializationResponse) => {
        this.Specializations = response.data;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading specializations:', err);
      },
    });
  }

  // async registerSubmit(): Promise<void> {
  //   this.usernameError = '';

  //   if (this.registerForm.invalid || !this.selectedImage) {
  //     this.registerForm.markAllAsTouched();
  //     return;
  //   }

  //   try {
  //     // 1. Get FCM token
  //     const fcmToken =
  //       await this._FirebaseMessaging.requestPermissionAndGetToken();

  //     const formData = new FormData();

  //     // Append all form values
  //     Object.keys(this.registerForm.value).forEach((key) => {
  //       if (key !== 'ImageFile' && this.registerForm.value[key] !== null) {
  //         formData.append(key, this.registerForm.value[key]);
  //       }
  //     });

  //     if (this.registerForm.value.DateOfBirth) {
  //       const date = new Date(this.registerForm.value.DateOfBirth);
  //       if (!isNaN(date.getTime())) {
  //         // Check if valid date
  //         formData.set('DateOfBirth', date.toISOString());
  //       }
  //     }

  //     // Append the image file
  //     if (this.selectedImage) {
  //       formData.append('ImageFile', this.selectedImage);
  //     }

  //     // const formData = this.registerForm.value;
  //     this._authService.register(formData).subscribe({
  //       next: (res: any) => {
  //         if (res.isSuccess && res.token) {
  //           this._authService.saveToken(res.token);
  //           this.registerForm.reset();
  //           if (fcmToken) {
  //             try {
  //               await this._FirebaseMessaging
  //                 .sendTokenToBackend(fcmToken)
  //                 .toPromise();
  //               console.log('FCM token successfully sent to backend');
  //             } catch (error) {
  //               console.error('Error sending FCM token to backend:', error);
  //             }
  //           }
  //           alert('succesful');
  //           // this._router.navigate(['/home']);
  //         } else {
  //           alert('حدث خطأ أثناء التسجيل');
  //         }
  //       },
  //       error: (err: HttpErrorResponse) => {
  //         console.error(err);
  //         if (err.error?.message?.includes('Username already exists')) {
  //           this.usernameError =
  //             'اسم المستخدم موجود بالفعل، يرجى اختيار اسم آخر';
  //           this.registerForm.get('userName')?.setErrors({ notUnique: true });
  //           this.registerForm.get('userName')?.markAsTouched();
  //         }
  //         // alert('حدث خطأ أثناء التسجيل');
  //       },
  //     });
  //   } catch (error) {
  //     console.error('Error in registration process:', error);
  //     alert('حدث خطأ أثناء التسجيل');
  //   }
  // }
  async registerSubmit(): Promise<void> {
    this.usernameError = '';

    if (this.registerForm.invalid || !this.selectedImage) {
      this.registerForm.markAllAsTouched();
      return;
    }

    try {
      // 1. Get FCM token
      const fcmToken =
        await this._FirebaseMessaging.requestPermissionAndGetToken();

      const formData = new FormData();

      // 2. Append form values
      Object.keys(this.registerForm.value).forEach((key) => {
        if (key !== 'ImageFile' && this.registerForm.value[key] !== null) {
          formData.append(key, this.registerForm.value[key]);
        }
      });

      // 3. Format date
      if (this.registerForm.value.DateOfBirth) {
        const date = new Date(this.registerForm.value.DateOfBirth);
        if (!isNaN(date.getTime())) {
          formData.set('DateOfBirth', date.toISOString());
        }
      }

      // 4. Add image
      if (this.selectedImage) {
        formData.append('ImageFile', this.selectedImage);
      }

      // 5. Register
      const res: any = await this._authService.register(formData).toPromise();

      if (res.isSuccess && res.token) {
        this._authService.saveToken(res.token);
        console.log('Token saved:', localStorage.getItem('token'));
        this.registerForm.reset();

        // 6. Send token
        if (fcmToken) {
          try {
            await this._FirebaseMessaging
              .sendTokenToBackend(fcmToken, res.token)
              .toPromise();
            console.log('Token before sending to backend:', localStorage.getItem('token'));  
            console.log('✅ FCM token sent to backend');
          } catch (error) {
            console.error('❌ Error sending FCM token:', error);
          }
        }

        alert('✅ تم التسجيل بنجاح');
        this._router.navigate(['/TodayAppointments']);
      } else {
        alert('❌ حدث خطأ أثناء التسجيل');
      }
    } catch (err: any) {
      console.error('❌ Error during registration:', err);

      if (err.error?.message?.includes('Username already exists')) {
        this.usernameError = 'اسم المستخدم موجود بالفعل، يرجى اختيار اسم آخر';
        this.registerForm.get('userName')?.setErrors({ notUnique: true });
        this.registerForm.get('userName')?.markAsTouched();
      } else {
        alert('❌ حدث خطأ أثناء التسجيل');
      }
    }
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImage = input.files[0];
      this.registerForm.patchValue({
        ImageFile: this.selectedImage.name,
      });
    }
  }
}
