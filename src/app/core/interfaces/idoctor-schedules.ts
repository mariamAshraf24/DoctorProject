export interface IDoctorSchedules {
    id: string;
    startTime: string;
    endTime: string;
    slotDuration:string;
    dayOfWeek: any;
    doctorId: string;
    date: string;
    slotTime: string;
    // id?: string; 
     
}

export interface IDoctorSchedulesResponse {
  success: boolean;
  message: string;
  data: IDoctorSchedules[];
  errors: any;
}
