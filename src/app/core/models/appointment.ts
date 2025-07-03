export interface Appointment {
  id: number;
  patientId: string;
  patientFullName: string;
  phone: string | null;
  startTime: string;
  appointmentType: number;
  status: number;
  turnNumber: number;
}