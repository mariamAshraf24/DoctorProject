import { FormGroup, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { Auth } from './../../../core/services/auth';
import { Component, Inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  LoginForm!: FormGroup;
  private readonly _formBuilder = Inject(FormBuilder);
  private readonly _authService = Inject(Auth);
  private readonly _Router = Inject(Router);

  ngOnInit(): void {
    this.LoginForm = this._formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/)
      ]],

    });
  }

  LoginSubmit(): void {
    if (this.LoginForm.invalid) {
      this.LoginForm.markAllAsTouched();
      return;
    }
    const formData = this.LoginForm.value;
    this._authService.login(formData).subscribe({
      next: (res: any) => {
        if (res.isSuccess && res.token) {
          this._authService.saveToken(res.token);
          alert('تم التسجيل بنجاح!');
          // this.LoginForm.reset();
          setTimeout(()=>{
            this._Router.navigate('/home');
          },1000)
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
