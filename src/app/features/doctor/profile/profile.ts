import { Component, OnInit } from '@angular/core';
import { Doctor } from '../../../core/services/doctor';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit{
  doctor!: Doctor;

  constructor(private _DoctorService: Doctor) {}

  ngOnInit(): void {
    this._DoctorService.getProfile().subscribe({
      next: (res) => (this.doctor = res.data),
      error: (err) => console.error(err)
    });
  }

}
