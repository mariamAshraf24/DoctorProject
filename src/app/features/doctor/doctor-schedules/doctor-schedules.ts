import { CommonModule } from '@angular/common';
// import { Doctor } from './../../app/core/models/Doctor';
// import { IDoctorSchedules } from '../../app/core/models/doctor-schedules.';
// import { DoctorSchedulesService } from '../../app/core/services/doctor-schedules';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router} from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { DoctorSchedulesService } from '../../../core/services/doctor-schedules';
import { IDoctorSchedules } from '../../../core/models/idoctor-schedules';


@Component({
  selector: 'app-doctor-schedules',
  imports: [CommonModule, FormsModule],
  templateUrl: './doctor-schedules.html',
  styleUrls: ['./doctor-schedules.scss','./doctor-schedules.temp.scss'],
})
export class DoctorSchedules implements OnInit {
  private _doctorSchedulesService = inject(DoctorSchedulesService);
  private readonly _authService = inject(Auth);


// const doctorId = this._authService.getCurrentDoctorId();

  DoctorScheduleslist: IDoctorSchedules[] = [];
  morningSchedules: IDoctorSchedules[] = [];
  eveningSchedules: IDoctorSchedules[] = [];
  private dayOrder = [0,1,2,3,4,5,6]; // ترتيب الأيام من الأحد للسبت
  
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

  // دالة تتحقق إذا كان هناك تداخل بين فترتين زمنيتين
  isOverlapping(start1: string, end1: string, start2: string, end2: string): boolean {
    const toMinutes = (t: string) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };
    const s1 = toMinutes(start1);
    const e1 = toMinutes(end1);
    const s2 = toMinutes(start2);
    const e2 = toMinutes(end2);
    return s1 < e2 && s2 < e1;
  }

  // دالة إضافة جديدة
  addSchedule(): void {
    this.addError = null;
    
    // تحقق من صحة البيانات بشكل بسيط
    if (!this.addForm.startTime || !this.addForm.endTime || !this.addForm.slotDurationMinutes || this.addForm.daysOfWeek.length === 0) {
      this.addError = 'يجب ملء جميع الحقول واختيار يوم واحد على الأقل';
      return;
    }

    // تحقق أن وقت الانتهاء بعد وقت البدء
    const start = this.addForm.startTime.split(":").map(Number);
    const end = this.addForm.endTime.split(":").map(Number);
    // تحويل الوقت إلى دقائق منذ منتصف الليل
    const startMinutes = start[0] * 60 + start[1];
    const endMinutes = end[0] * 60 + end[1];
    if (endMinutes <= startMinutes) {
      this.addError = 'يجب أن يكون وقت الانتهاء بعد وقت البدء';
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

    // تحقق من عدم وجود تداخل في نفس اليوم
    for (const day of this.addForm.daysOfWeek) {
      const sameDaySchedules = this.DoctorScheduleslist.filter((s: IDoctorSchedules) => s.dayOfWeek === day);
      for (let s of sameDaySchedules) {
        if (this.isOverlapping(this.addForm.startTime, this.addForm.endTime, s.startTime, s.endTime)) {
          this.addError = 'يوجد موعد آخر يتقاطع مع هذا الوقت في نفس اليوم!';
          return;
        }
      }
    }

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
          this.loadSchedules(); // إعادة تحميل المواعيد من السيرفر
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
        // ترتيب المواعيد حسب اليوم
        let sorted = (res.data || []).slice().sort((a: IDoctorSchedules, b: IDoctorSchedules) => {
          return this.dayOrder.indexOf(a.dayOfWeek) - this.dayOrder.indexOf(b.dayOfWeek);
        });
        // تقسيم المواعيد إلى صباحية ومسائية
        this.morningSchedules = sorted.filter((s: IDoctorSchedules) => this.isMorning(s.startTime));
        this.eveningSchedules = sorted.filter((s: IDoctorSchedules) => !this.isMorning(s.startTime));
        this.DoctorScheduleslist = res.data;
      },
      error: (err) => {
        console.error('Error fetching doctor schedules:', err);
      }
    });
  }

  // دالة تحديد إذا كان الموعد صباحي
  isMorning(time: string): boolean {
    // يعتبر صباحي إذا كان قبل 12:00
    if (!time) return true;
    const hour = +time.split(":")[0];
    return hour < 12;
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
        this.loadSchedules(); // إعادة تحميل المواعيد من السيرفر
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









