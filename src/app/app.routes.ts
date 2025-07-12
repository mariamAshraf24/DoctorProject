import { Component } from '@angular/core';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { ForgotPassword } from './features/auth/forgot-password/forgot-password';
import { DoctorLayout } from './layouts/doctor-layout/doctor-layout';
import { RoleGuard } from './guards/RoleGurad';
import { Calendar } from './features/doctor/calendar/calendar';
import { AppointmentsByDate } from './features/doctor/appointments-by-date/appointments-by-date';
import { Routes } from '@angular/router';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { AdminComponent } from './features/Admin/admin/admin';
import { SpecializationDetails } from './features/Admin/specialization-details/specialization-details';
import { Profile } from './features/doctor/profile/profile';
import { TodayAppointments } from './features/doctor/today-appointments/today-appointments';
import { CancalAppointment } from './features/doctor/cancel-appointment/cancal-appointment';
import { DelayAppointment } from './features/doctor/delay-appointment/delay-appointment';
import { UpdateProfile } from './features/doctor/update-profile/update-profile';
import { AppointmentCalendar } from './features/doctor/appointment-calendar/appointment-calendar';
import { Home } from './features/doctor/home/home';


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
            { path: 'today-appointments', component: TodayAppointments },
            { path: 'calendar', component: Calendar },
            { path: 'AppointmentsByDate/:date', component: AppointmentsByDate },
            { path: 'profile', component: Profile },
            { path: 'update-profile', component: UpdateProfile },
            { path: 'cancel-appointment', component: CancalAppointment },
            { path: 'delay-appointment', component: DelayAppointment },
            { path: 'appointment-calendar', component: AppointmentCalendar },

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

    { path: '**', redirectTo: 'login' }, // fallback route
];

