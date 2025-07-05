export interface Doctor {
  id: string;
  fName: string;
  lName: string;
  city: string;
  street: string;
  country: string;
  dateOfBirth: string;
  gender: number;
  bookingPrice: number;
  specializationName: string;
  imageUrl: string;
}

export interface DoctorProfileResponse {
  success: boolean;
  message: string;
  data: Doctor;
  errors: null | any;
}