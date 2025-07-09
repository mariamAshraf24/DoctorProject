import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { ForgotPassword } from './features/auth/forgot-password/forgot-password';
import { DoctorLayout } from './layouts/doctor-layout/doctor-layout';
import { RoleGuard } from './guards/RoleGurad';
import { Calendar } from './features/doctor/calendar/calendar';
import { AppointmentsByDate } from './features/doctor/appointments-by-date/appointments-by-date';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { AdminComponent } from './features/Admin/admin/admin';
import { SpecializationDetails } from './features/Admin/specialization-details/specialization-details';
import { Profile } from './features/doctor/profile/profile';
import { TodayAppointments } from './features/doctor/today-appointments/today-appointments';
import { CancalAppointment } from './features/doctor/cancel-appointment/cancal-appointment';
import { DelayAppointment } from './features/doctor/delay-appointment/delay-appointment';
import { DoctorReport } from './features/doctor/doctor-report/doctor-report';

import { DoctorSchedules } from '../components/doctor-schedules/doctor-schedules';
import { DoctorSchedulesDetails } from '../components/doctor-schedules-details/doctor-schedules-details';

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
      { path: '', redirectTo: 'today-appointments', pathMatch: 'full' },
      { path: 'today-appointments', component: TodayAppointments },
      { path: 'calendar', component: Calendar },
      { path: 'AppointmentsByDate/:date', component: AppointmentsByDate },
      { path: 'profile', component: Profile },
      { path: 'cancel-appointment', component: CancalAppointment },
      { path: 'delay-appointment', component: DelayAppointment },
      { path: 'doctor-report', component: DoctorReport },
      { path: 'doctor-schedules', component: DoctorSchedules },
      { path: 'doctor-schedules-details/:doctorId/:date', component: DoctorSchedulesDetails },
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
