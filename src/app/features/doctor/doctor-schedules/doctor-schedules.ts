import { CommonModule } from '@angular/common';
import { Doctor } from '../../../core/models/IDoctor';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { DoctorSchedulesService } from '../../../core/services/doctor-schedules';
import { IDoctorSchedules } from '../../../core/models/idoctor-schedules';


@Component({
  selector: 'app-doctor-schedules',
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './doctor-schedules.html',
  styleUrl: './doctor-schedules.scss'
})
export class DoctorSchedules implements OnInit {
  private _doctorSchedulesService = inject(DoctorSchedulesService);
  private readonly _authService = inject(Auth);


// const doctorId = this._authService.getCurrentDoctorId();

  DoctorScheduleslist: IDoctorSchedules[] = [];
  
  // doctorId للطبيب الحالي - يمكن تغييره حسب الطبيب المطلوب
  currentDoctorId: string = this._authService.getCurrentDoctorId();


 

  // متغيرات فورم الإضافة
  addForm = {
    startTime: '',
    endTime: '',
    slotDurationMinutes: 30,
    daysOfWeek: [] as number[]
  };
  addError: string | null = null;
  showDaysDropdown: boolean = false;
  showAddForm: boolean = false;

  constructor(private router: Router) { }

  // دالة التعامل مع تغيير الأيام
  onDayChange(event: any, day: number): void {
    if (event.target.checked) {
      if (!this.addForm.daysOfWeek.includes(day)) {
        this.addForm.daysOfWeek.push(day);
      }
    } else {
      this.addForm.daysOfWeek = this.addForm.daysOfWeek.filter(d => d !== day);
    }
  }

  // دالة عرض الأيام المختارة
  getSelectedDaysText(): string {
    if (this.addForm.daysOfWeek.length === 0) {
      return 'اختر الأيام';
    } else if (this.addForm.daysOfWeek.length === 7) {
      return 'جميع الأيام';
    } else {
      const selectedDays = this.addForm.daysOfWeek
        .sort((a, b) => a - b)
        .map(day => this.getDayName(day))
        .join(', ');
      return selectedDays;
    }
  }

  // دالة فتح/إغلاق dropdown الأيام
  toggleDaysDropdown(): void {
    this.showDaysDropdown = !this.showDaysDropdown;
  }

  ngOnInit(): void {
    this.loadSchedules();

    // إغلاق dropdown عند الضغط خارجه
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.position-relative')) {
        this.showDaysDropdown = false;
      }
    });
  }

  getDayName(day: number): string {
    const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    return days[day] ?? day;
  }

  // دالة إضافة جديدة
  addSchedule(): void {
    this.addError = null;
    
    // تحقق من صحة البيانات بشكل بسيط
    if (!this.addForm.startTime || !this.addForm.endTime || !this.addForm.slotDurationMinutes || this.addForm.daysOfWeek.length === 0) {
      this.addError = 'يجب ملء جميع الحقول واختيار يوم واحد على الأقل';
      return;
    }

    // تأكد أن الأوقات بصيغة صحيحة
    let startTime = this.addForm.startTime;
    let endTime = this.addForm.endTime;

    // إضافة :00 للأوقات إذا لم تكن موجودة
    if (startTime && startTime.split(':').length === 2) {
      startTime = startTime + ':00';
    }
    
    if (endTime && endTime.split(':').length === 2) {
      endTime = endTime + ':00';
    }
    
    // تحويل الدقائق إلى صيغة HH:mm:ss
    const minutes = this.addForm.slotDurationMinutes;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const slotDuration = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:00`;

    // تأكد أن daysOfWeek أرقام
    const daysOfWeek = this.addForm.daysOfWeek.map(day => Number(day));

    const payload = {
      startTime: startTime,
      endTime: endTime,
      slotDuration: slotDuration,
      daysOfWeek: daysOfWeek
    };

    console.log('Payload being sent:', payload);

    this._doctorSchedulesService.addSchedule(payload).subscribe({
      next: (res) => {
        console.log('Success response:', res);
        if (res.success) {
          // الريسبونس فيه data عبارة عن array
          // نعيد تحميل الجدول من الريسبونس مباشرة
          this.DoctorScheduleslist = res.data;
          // إعادة تعيين الفورم
          this.addForm = { startTime: '', endTime: '', slotDurationMinutes: 30, daysOfWeek: [] };
        } else {
          this.addError = res.message || 'حدث خطأ أثناء الإضافة';
        }
      },
      error: (err) => {
        console.error('Error response:', err);
        this.addError = 'حدث خطأ أثناء الإضافة: ' + (err.error?.message || err.message || 'خطأ غير معروف');
      }
    });
  }

  // Helper to get doctorId for a schedule (replace with real logic if available)
  getDoctorId(schedule: any): string {
    // استخدام doctorId للطبيب الحالي
    return this.currentDoctorId;
    }

  // دالة لتحديث doctorId وإعادة تحميل البيانات
  updateDoctorId(newDoctorId: string): void {
    this.currentDoctorId = newDoctorId;
    this.loadSchedules();
  }

  // دالة تحميل البيانات
  loadSchedules(): void {
    this._doctorSchedulesService.getAllSchedules().subscribe({
      next: (res) => {
        console.log('Schedules from API:', res.data);
        if (res.data && res.data.length > 0) {
          console.log('First schedule structure:', res.data[0]);
          console.log('Available properties:', Object.keys(res.data[0]));
        }
        this.DoctorScheduleslist = res.data;
      },
      error: (err) => {
        console.error('Error fetching doctor schedules:', err);
      }
    });
  }

  // Helper to get date for a schedule (replace with real logic if available)
  getDateForSchedule(schedule: any): string {
    // If you have a date property, return it. Otherwise, use today's date as a placeholder.
    return schedule.date || new Date().toISOString().slice(0, 10); // yyyy-mm-dd
  }

  // دالة لحساب أقرب تاريخ قادم ليوم الأسبوع المطلوب
  getNextDateForDay(dayOfWeek: number): string {
    const today = new Date();
    const todayDay = today.getDay(); // 0: الأحد ... 6: السبت
    // تحويل dayOfWeek من النظام العربي (الأحد=0) إلى نظام جافاسكريبت (الأحد=0)
    let diff = dayOfWeek - todayDay;
    if (diff < 0) diff += 7;
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + diff);
    // صيغة yyyy-MM-dd فقط
    return nextDate.toISOString().slice(0, 10);
  }

  // viewScheduleDetails(schedule: any): void {
  //   const date = this.getNextDateForDay(schedule.dayOfWeek);
  //   this.router.navigate(['/doctor-schedules-details'], {
  //     queryParams: { doctorId: this.doctorId, date }
  //   });
  // }

  deleteSchedule(id:string): void {
    console.log('Schedule to delete:', id);

    const confirmed = window.confirm('هل أنت متأكد أنك تريد حذف هذا الموعد؟');
    if (!confirmed) {
      return;
    }
    
    // استخدام الـ ID للحذف
    this._doctorSchedulesService.deleteSchedule(id).subscribe({
      next: (res) => {
        console.log('Schedule deleted successfully:', res);
        // إزالة العنصر من القائمة
        this.DoctorScheduleslist = this.DoctorScheduleslist.filter(s => s.id !== id);
      },
      error: (err) => {
        console.error('Error deleting schedule:', err);
        alert('لا يمكن حذف هذا الموعد');
      }
    });
  }



  openAddForm() {
    this.showAddForm = true;
  }
  closeAddForm() {
    this.showAddForm = false;
    this.addError = null;
  }
}





// deleteSchedule(id: string): void {
//   this._doctorSchedulesService.deleteSchedule(id).subscribe({
//     next: (res) => {
//       console.log('Schedule deleted successfully:', res);
//       this.DoctorScheduleslist = this.DoctorScheduleslist.filter(schedule => schedule.id !== id);
//     },
//     error: (err) => {
//       console.error('Error deleting schedule:', err);
//     }
//   });
// }









