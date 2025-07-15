import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { ForgotPassword } from './features/auth/forgot-password/forgot-password';
import { DoctorLayout } from './layouts/doctor-layout/doctor-layout';
import { RoleGuard } from './guards/RoleGurad';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { AdminComponent } from './features/Admin/admin/admin';
import { SpecializationDetails } from './features/Admin/specialization-details/specialization-details';
import { Profile } from './features/doctor/profile/profile';
import { UpdateProfile } from './features/doctor/update-profile/update-profile';
import { AppointmentCalendar } from './features/doctor/appointment-calendar/appointment-calendar';
import { Home } from './features/doctor/home/home';
import { DoctorReport } from './features/doctor/doctor-report/doctor-report';
import { DoctorSchedules } from './features/doctor/doctor-schedules/doctor-schedules';

import { NotFound } from './features/not-found/not-found';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'Register', component: Register },
  { path: 'forgotPassword', component: ForgotPassword },

  {
    path: 'doctor',
    component: DoctorLayout,
    canActivate: [RoleGuard],
    data: { role: 'Doctor' },
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: Home },
      { path: 'profile', component: Profile },
      { path: 'update-profile', component: UpdateProfile },
      { path: 'doctor-report', component: DoctorReport },
      { path: 'appointment-calendar', component: AppointmentCalendar },
      { path: 'doctor-report', component: DoctorReport },
      { path: 'doctor-schedules', component: DoctorSchedules },
    ],
  },
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [RoleGuard],
    data: { role: 'Admin' },
    children: [
      { path: 'Specializations', component: AdminComponent },
      { path: 'SpecializationDetails/:id', component: SpecializationDetails },
    ],
  },

  { path: '**', component: NotFound }, // fallback route
];
