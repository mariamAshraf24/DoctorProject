import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DoctorService } from '../../../core/services/doctor-service';
import { Doctor } from '../../../core/models/IDoctor';

@Component({
  selector: 'app-profile',
  imports: [RouterModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  doctorProfile: Doctor | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(private _DoctorService: DoctorService) {}

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
      },
    });
  }

  getGenderText(gender: number): string {
    return gender === 1 ? 'Male' : gender === 2 ? 'Female' : 'Other';
  }

  // formatDate(dateString: string): string {
  //   const date = new Date(dateString);
  //   return date.toLocaleDateString();
  // }

  getAge(dateString: string): number {
    const birthDate = new Date(dateString);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    return age;
  }
  onImageSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      const newImageUrl = reader.result as string;

      if (this.doctorProfile) {
        const updatedData = {
          fName: this.doctorProfile.fName,
          lName: this.doctorProfile.lName,
          city: this.doctorProfile.city,
          street: this.doctorProfile.street,
          country: this.doctorProfile.country,
          bookingPrice: this.doctorProfile.bookingPrice,
          imageUrl: newImageUrl  
        };

        this._DoctorService.updateDoctorProfile(updatedData).subscribe({
          next: () => {
            this.doctorProfile!.imageUrl = newImageUrl;
          },
          error: (err) => {
            console.error('فشل في تحديث الصورة', err);
            this.error = 'فشل في تحديث الصورة، حاول مرة أخرى';
          }
        });
      }
    };

    reader.readAsDataURL(file); // تقرأ الصورة كرابط base64
  }
}


}
