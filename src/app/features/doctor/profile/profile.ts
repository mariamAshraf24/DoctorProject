import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DoctorService } from '../../../core/services/doctor-service';
import { Doctor } from '../../../core/models/IDoctor';

@Component({
  selector: 'app-profile',
  imports: [RouterModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit{
  doctorProfile: Doctor | null = null;
  isLoading = true;
  error: string | null = null;
  
  constructor(private _DoctorService: DoctorService) { }

  ngOnInit(): void {
    this.loadDoctorProfile();
  } 

  loadDoctorProfile(): void {
    this.isLoading = true;
    this.error = null;
    
    this._DoctorService.getDoctorProfile().subscribe({
      next: (response) => {
        this.doctorProfile = response.data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load doctor profile. Please try again later.';
        this.isLoading = false;
        console.error('Error loading doctor profile:', err);
      }
    });
  }

   getGenderText(gender: number): string {
    return gender === 1 ? 'Male' : gender === 2 ? 'Female' : 'Other';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

}
