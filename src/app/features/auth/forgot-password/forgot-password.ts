import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Auth } from '../../../core/services/auth';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss'
})
export class ForgotPassword implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  step: number = 1;

  forgotPassword: FormGroup = this.fb.group({
    email: [null, [Validators.required, Validators.email]]
  });

  resetPassword: FormGroup = this.fb.group({
    token: [null, Validators.required],
    email: [null, [Validators.required, Validators.email]],
    newPassword: [null, [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/)
    ]]
  });

  ngOnInit(): void {
    const tokenFromUrl = this.route.snapshot.queryParamMap.get('token');
    const emailFromUrl = this.route.snapshot.queryParamMap.get('email');

    if (tokenFromUrl && emailFromUrl) {
      this.resetPassword.controls['token'].setValue(tokenFromUrl);
      this.resetPassword.controls['email'].setValue(emailFromUrl);
      this.step = 2;
    }
  }

  submitEmail() {
    if (this.forgotPassword.invalid) return;

    this.auth.forgotPassword(this.forgotPassword.value.email).subscribe({
      next: () => {
        alert('تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني');
        // لا يتم تغيير الخطوة هنا، فقط تأكيد الإرسال
      },
      error: (err) => {
        console.log('فشل:', err);
        alert('حدث خطأ أثناء إرسال الإيميل');
      }
    });
  }

  submitResetPassword(): void {
    if (this.resetPassword.invalid) {
      alert('البيانات غير مكتملة أو خاطئة');
      return;
    }

    const data = this.resetPassword.value;

    this.auth.resetPassword(data).subscribe({
      next: () => {
        alert('تم تعيين كلمة المرور بنجاح');
        this.router.navigate(['/login']); // ✅ تحويل لصفحة تسجيل الدخول
      },
      error: (err) => {
        console.error('فشل تعيين كلمة المرور:', err);
        alert('فشل تعيين كلمة المرور');
      }
    });
  }
}
