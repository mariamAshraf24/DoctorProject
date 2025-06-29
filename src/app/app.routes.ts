import { Routes } from '@angular/router';
import { Register } from './features/auth/register/register';
import { Home } from './features/home/home';

export const routes: Routes = [
    { path: '', redirectTo: 'register', pathMatch: 'full' },
    { path: 'register', component: Register },
    { path: 'home', component: Home },

];
