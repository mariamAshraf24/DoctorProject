// import { Component, Inject, inject } from '@angular/core';
// import { FormGroup, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
// import { Auth } from '../../core/services/auth';

// @Component({
//   selector: 'app-forgot-password',
//   imports: [ReactiveFormsModule],
//   templateUrl: './forgot-password.html',
//   styleUrl: './forgot-password.scss'
// })
// export class ForgotPassword {
//   private readonly _Auth=inject(Auth);
//     private readonly _formBuilder = inject(FormBuilder);
//   step:number=1;

//   verifyEmail: FormGroup = this._formBuilder.group({
//     email: [null, [Validators.required, Validators.email]],
//   })

//   verifyCode: FormGroup = this._formBuilder.group({
//     resetCode: [null, [Validators.required, Validators.pattern(/^[0,9]{6}$/)]],
//   })


//   verifyPassword: FormGroup = this._formBuilder.group({
//     email: [null, [Validators.required, Validators.email]],
//     password: [null, [
//       Validators.required,
//       Validators.minLength(8),
//       Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/)
//     ]],
//   })
// verivyEmailSubmit():void{
// this._Auth.setEmailVerify(this.verifyEmail.value).subscribe({
//   next:(res)=>{
//     console.log(rse);
//   },
//   error:()=>{

//   }
// })
// }
// }
import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss'
})
export class ForgotPassword {
  private readonly _auth = inject(Auth);
  private readonly _formBuilder = inject(FormBuilder);

  step: number = 1;

  verifyEmail: FormGroup = this._formBuilder.group({
    email: [null, [Validators.required, Validators.email]],
  });

  verifyCode: FormGroup = this._formBuilder.group({
    resetCode: [null, [Validators.required, Validators.pattern(/^\d{6}$/)]],
  });

  verifyPassword: FormGroup = this._formBuilder.group({
    email: [null, [Validators.required, Validators.email]],
    password: [null, [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/)
    ]]
  });

  verivyEmailSubmit(): void {
    if (this.verifyEmail.invalid) return;

    this._auth.forgotPassword(this.verifyEmail.value).subscribe({
      next: (res) => {
        alert('تم إرسال رمز التحقق إلى بريدك الإلكتروني');
        this.verifyPassword.controls['email'].setValue(this.verifyEmail.value.email);
        this.step = 2;
      },
      error: () => {
        alert('فشل إرسال رمز التحقق');
      }
    });
  }

  verifyCodeSubmit(): void {
    if (this.verifyCode.invalid) return;

    const code = this.verifyCode.value.resetCode;
    // تقدرِ تعملي تحقق إضافي هنا لو محتاجة
    this.step = 3;
  }

  resetPasswordSubmit(): void {
    if (this.verifyPassword.invalid || this.verifyCode.invalid) return;

    const data = {
      email: this.verifyPassword.value.email,
      password: this.verifyPassword.value.password,
      resetCode: this.verifyCode.value.resetCode
    };

    this._auth.resetPassword(data).subscribe({
      next: () => {
        alert('تم تعيين كلمة مرور جديدة بنجاح');
        this.step = 1;
        this.verifyEmail.reset();
        this.verifyCode.reset();
        this.verifyPassword.reset();
      },
      error: () => {
        alert('فشل تعيين كلمة المرور');
      }
    });
  }
}
