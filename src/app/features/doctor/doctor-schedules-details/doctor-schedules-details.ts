import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DoctorSchedulesService } from '../../../core/services/doctor-schedules';
import { IDoctorSchedules } from '../../../core/models/idoctor-schedules';


@Component({
  selector: 'app-doctor-schedules-details',
  imports: [CommonModule, RouterLink],
  templateUrl: './doctor-schedules-details.html',
  styleUrl: './doctor-schedules-details.scss'
})
export class DoctorSchedulesDetails implements OnInit {

  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _DoctorSchedulesService = inject(DoctorSchedulesService);

  detailsschedule : IDoctorSchedules | null = null;
  schedulesList: IDoctorSchedules[] = [];
  loading: boolean = false;
  error: string | null = null;

  getDayName(day: number): string {
    const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    return days[day] ?? day;
  }


 

  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe({
      next:( p)=>{
       let doctorid =  p.get('doctorId');
       let scheduledate = p.get('date');

       console.log('Doctor ID:', doctorid);
       console.log('Schedule Date:', scheduledate);

       // التحقق من وجود البيانات المطلوبة
       if (!doctorid || !scheduledate) {
         this.loading = false;
         this.error = 'بيانات غير صحيحة: doctorId أو date مفقودة';
         return;
       }

       this.loading = true;
       this.error = null;

       this._DoctorSchedulesService.getScheduleByDoctorIdAndDate(doctorid,scheduledate).subscribe({
        next:(res)=> {
          console.log('API Response:', res)
          this.loading = false;
          // التعامل مع array من المواعيد
          if (Array.isArray(res)) {
            this.schedulesList = res;
            if (res.length > 0) {
              this.detailsschedule = res[0]; // أول موعد كـ sample
            }
          } else if (res.data && Array.isArray(res.data)) {
            this.schedulesList = res.data;
            if (res.data.length > 0) {
              this.detailsschedule = res.data[0];
            }
          } else if (res.data) {
            this.schedulesList = [res.data];
            this.detailsschedule = res.data;
          } else {
            this.schedulesList = [res];
            this.detailsschedule = res;
          }
        },
        error:(err)=>{
          console.log('API Error:', err)
          this.loading = false;
          this.error = 'حدث خطأ في تحميل البيانات: ' + (err.error?.message || err.message || 'خطأ غير معروف');
        }
       })

      }
    })
      
    };
  
  
}
