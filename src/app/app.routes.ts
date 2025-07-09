
import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { AdminComponent } from '../components/admin/admin';
import { SpecializationDetails } from '../components/specialization-details/specialization-details';
import { DoctorSchedules } from '../components/doctor-schedules/doctor-schedules';
import { Register } from './features/auth/register/register';
import { Login } from './features/auth/login/login';
// import { ForgotPassword } from './features/forgot-password/forgot-password';
import { DoctorSchedulesDetails } from '../components/doctor-schedules-details/doctor-schedules-details';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'Register', component: Register },
  { path: 'Specializations', component: AdminComponent },
  { path: 'SpecializationDetails/:id', component: SpecializationDetails },
  // { path: 'SpecializationDetails/:id', component: AdminComponent} // تأكدي من استيراد المكون المناسب
  { path: 'doctor-schedules', component: DoctorSchedules },
  { path: 'doctor-schedules-details/:doctorId/:date', component: DoctorSchedulesDetails },
  // { path: 'forgotPassword', component: ForgotPassword }

  // أضيفي هنا أي مسارات أخرى تحتاجينها
];