import { FormGroup, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { Auth } from './../../../core/services/auth';
import { Component, inject, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  private readonly _authService = inject(Auth);
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _Router = inject(Router);

  ngOnInit(): void {
    this.loginForm = this._formBuilder.group({
      userName: [null, [Validators.required, Validators.pattern(/^[\u0600-\u06FFa-zA-Z ]+$/)]],
      password: [null, [
        Validators.required,
        Validators.minLength(8),
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
          this._authService.saveToken(res.token);
          alert('تم التسجيل بنجاح!');
          this.loginForm.reset();

          localStorage.setItem('roles', res.roles);
          if (this._authService.isAdmin()) {
            this._Router.navigate(['/admin/Specializations']);
          } else {
            this._Router.navigate(['/doctor/today-appointments']);
          }
          // setTimeout(() => {
          //   this._Router.navigate(['/home']);
          // }, 1000)
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
