import { Routes } from '@angular/router';
import { Register } from './features/auth/register/register';
import { Login } from './features/auth/login/login';
import { ForgotPassword } from './features/forgot-password/forgot-password';
import { DoctorLayout } from './layouts/doctor-layout/doctor-layout';
import { RoleGuard } from './guards/RoleGurad';
import { Home } from './features/home/home';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { AdminDashboard } from './features/admin-dashboard/admin-dashboard';

export const routes: Routes = [
    {path:'' , component: Register},
    { path: 'login', component: Login},
    { path: 'Register', component: Register },
    { path: 'forgotPassword', component:ForgotPassword},
    {
        path: 'doctor',
        component: DoctorLayout,
        canActivate: [RoleGuard],
        data: { role: 'Doctor' }, 
        children:[{ path: '', component:Home}] 
    },
    {
        path: 'admin',
        canActivate: [RoleGuard],
        data: { role: 'Admin' },
        component: AdminLayout,
        children: [
            { path: 'dashboard', component: AdminDashboard }]
        }]
