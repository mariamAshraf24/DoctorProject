import { Component } from '@angular/core';
import { Doctor } from '../../../core/models/IDoctor';
import { DoctorService } from '../../../core/services/doctor-service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

  doctor: Doctor | null = null;
   
  constructor(private _DoctorService: DoctorService) {}

  ngOnInit(): void {
    this._DoctorService.getDoctorProfile().subscribe({
      next: (res) => {
        this.doctor = res.data;
      },
      error: (err) => {
        console.error('فشل تحميل بيانات الدكتور', err);
      }
    });
  }

}
