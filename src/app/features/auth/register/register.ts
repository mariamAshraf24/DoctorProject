import { FormGroup, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { Auth } from './../../../core/services/auth';
import { Component} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register{
    registerForm!: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _authService: Auth
  ) {}

  ngOnInit(): void {
    this.registerForm = this._formBuilder.group({
      name: [null, [Validators.required, Validators.pattern(/^[\u0600-\u06FFa-zA-Z ]+$/)]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/)
      ]],
      role: ['Doctor'],
      address: ['',Validators.required],
      dateOfBirth: [null, [Validators.required]],
      gender: [null, Validators.required],
      phone: ['', [
        Validators.required,
        Validators.pattern(/^(010|011|012|015)[0-9]{8}$/)
      ]],
      licenceNumber: [null, Validators.required],
      specializationId: [null, Validators.required],
      bookingPrice: [null, Validators.required],
      imageUrl: [null, Validators.required]
    });
  }
  
  registerSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    const formData = this.registerForm.value;
    this._authService.register(formData).subscribe({
      next: (res:any) => {
    if (res.isSuccess && res.token) {
      this._authService.saveToken(res.token);
      alert('تم التسجيل بنجاح!');
      this.registerForm.reset();
    } else {
      alert('حدث خطأ أثناء التسجيل');
    }
  },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        alert('حدث خطأ أثناء التسجيل');
      }
    });
  }
  
}