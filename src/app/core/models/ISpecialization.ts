export interface Doctor {
  id: string;
  name: string;
}

export interface Specialization {
  id: number;
  name: string;
  doctors: Doctor[];
}

export interface SpecializationResponse {
  success: boolean;
  message: string;
  data: Specialization[];
  errors: null | any;
}