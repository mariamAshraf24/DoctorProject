import { FormGroup, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { Auth } from './../../../core/services/auth';
import { Component, inject, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  usernameError: string = '';
  serverErrorMessage: string | null = null; 

  private readonly _authService = inject(Auth);
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _Router = inject(Router);

  ngOnInit(): void {
    this.loginForm = this._formBuilder.group({
      userName: [
        null,
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z\u0600-\u06FF0-9]*$/),
        ]],
      password: [null, [
        Validators.required,
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/)
      ]],
    });
  }

  loginSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const formData = this.loginForm.value;

    this._authService.login(formData).subscribe({
      next: (res) => {
        if (res.isSuccess && res.token) {
          this.serverErrorMessage = null; 
          this._authService.saveToken(res.token);
          this.loginForm.reset();

          const doctorId = this._authService.getDoctorIdFromToken();
          localStorage.setItem('doctorId', doctorId);
          localStorage.setItem('roles', res.roles);

          if (this._authService.isAdmin()) {
            this._Router.navigate(['/admin/Specializations']);
          } else {
            this._Router.navigate(['/doctor/home']);
          }
        }
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 400 && err.error?.message) {
          const message = err.error.message;

          
          if (message === 'Invalid email or password.') {
            this.serverErrorMessage = 'كلمة المرور غير صحيحة أو لا تطابق اسم المستخدم';
          } else {
            this.serverErrorMessage = 'حدث خطأ غير متوقع. حاول مرة أخرى.';
          }
        } else {
          this.serverErrorMessage = 'فشل في الاتصال بالخادم. حاول لاحقاً.';
        }
      }
    }); 
  }
}
