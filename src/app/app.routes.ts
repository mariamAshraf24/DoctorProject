import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { AdminComponent } from '../components/admin/admin'; // عدلي المسار حسب مكان الملف
import { SpecializationDetails } from '../components/specialization-details/specialization-details';

export const routes: Routes = [
  { path: '', redirectTo: 'Specializations', pathMatch: 'full' },
  { path: 'Specializations', component: AdminComponent },
  { path: 'SpecializationDetails/:id', component: SpecializationDetails },
  { path: 'SpecializationDetails/:id', component: AdminComponent} // تأكدي من استيراد المكون المناسب
  // أضيفي هنا أي مسارات أخرى تحتاجينها
];