import { Component } from '@angular/core';
import { Routes } from '@angular/router';
<<<<<<< HEAD
import { AdminComponent } from '../components/admin/admin'; // عدلي المسار حسب مكان الملف
import { SpecializationDetails } from '../components/specialization-details/specialization-details';

export const routes: Routes = [
  { path: '', redirectTo: 'Specializations', pathMatch: 'full' },
  { path: 'Specializations', component: AdminComponent },
  { path: 'SpecializationDetails/:id', component: SpecializationDetails },
  { path: 'SpecializationDetails/:id', component: AdminComponent} // تأكدي من استيراد المكون المناسب
  // أضيفي هنا أي مسارات أخرى تحتاجينها
];
=======
import { Register } from './features/auth/register/register';
import { Login } from './features/auth/login/login';
import { ForgotPassword } from './features/forgot-password/forgot-password';
import { DoctorLayout } from './layouts/doctor-layout/doctor-layout';
import { RoleGuard } from './guards/RoleGurad';
import { Home } from './features/home/home';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { AdminDashboard } from './features/admin-dashboard/admin-dashboard';
import { Calendar } from './features/doctor/calendar/calendar';
import { AppointmentsByDate } from './features/doctor/appointments-by-date/appointments-by-date';


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
        children: [{ path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: Home }]
    },
    {
        path: 'admin',
        canActivate: [RoleGuard],
        data: { role: 'Admin' },
        component: AdminLayout,
        children: [
            { path: 'dashboard', component: AdminDashboard }]
    },
    { path: 'calendar', component: Calendar },
    { path: 'AppointmentsByDate/:date', component: AppointmentsByDate },
]

    
>>>>>>> 8d6e5e9f63d415147212ceed0fd32ddf05f0b5b5
