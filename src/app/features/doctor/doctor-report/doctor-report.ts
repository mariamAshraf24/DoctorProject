import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { DoctorService } from '../../../core/services/doctor-service';
import {
  Chart,
  BarController, BarElement, LinearScale, CategoryScale,
  DoughnutController, ArcElement, Tooltip, Legend
} from 'chart.js';

Chart.register(
  BarController, BarElement, LinearScale, CategoryScale,
  DoughnutController, ArcElement, Tooltip, Legend
);

@Component({
  selector: 'app-doctor-dashboard',
  templateUrl: './doctor-report.html',
  styleUrls: ['./doctor-report.scss']
})
export class DoctorReport implements OnInit, OnDestroy {
  @ViewChild('monthChart') monthChartRef!: ElementRef;
  @ViewChild('yearChart') yearChartRef!: ElementRef;

  currentMonthReport: any = null;
  reportHistory: any[] = [];
  attendancePercentage = 0;
  yearlyTotal = 0;
  busiestMonth = '--';
  currentYear = new Date().getFullYear();
  currentMonthNumber = new Date().getMonth() + 1;

  yearlyAttended = 0;
  yearlyCancelled = 0;
  yearlyPostponed = 0;
  yearlyMissed = 0;

  monthChart: Chart | null = null;
  yearChart: Chart | null = null;

  constructor(private doctorService: DoctorService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    this.monthChart?.destroy();
    this.yearChart?.destroy();
  }

  loadDashboardData(): void {
    const year = this.currentYear;
    const month = this.currentMonthNumber;

    // ✅ تحميل بيانات الشهر الحالي فقط في البداية
    this.doctorService.getMonthlyReport(year, month).subscribe({
      next: (res) => {
        this.currentMonthReport = res.success ? res.data : this.getFallbackMonthlyData();
        this.calculateAttendancePercentage();
        this.renderMonthChart();
      },
      error: () => {
        this.currentMonthReport = this.getFallbackMonthlyData();
        this.calculateAttendancePercentage();
        this.renderMonthChart();
      }
    });

    // ✅ تحميل كل الشهور مرة واحدة فقط
    this.doctorService.getReportHistory().subscribe({
      next: (res) => {
        this.reportHistory = res.success ? res.data : this.getFallbackYearlyData();
        this.calculateYearlyStats();
        this.renderYearChart();
      },
      error: () => {
        this.reportHistory = this.getFallbackYearlyData();
        this.calculateYearlyStats();
        this.renderYearChart();
      }
    });
  }

  calculateAttendancePercentage(): void {
    if (!this.currentMonthReport) return;
    const total = this.currentMonthReport.totalAppointments || 0;
    const attended = this.currentMonthReport.attended || 0;
    this.attendancePercentage = total ? Math.round((attended / total) * 100) : 0;
  }

  calculateYearlyStats(): void {
    this.yearlyTotal = 0;
    this.yearlyAttended = 0;
    this.yearlyCancelled = 0;
    this.yearlyPostponed = 0;
    this.yearlyMissed = 0;

    for (const r of this.reportHistory) {
      this.yearlyTotal += r.totalAppointments || 0;
      this.yearlyAttended += r.attended || 0;
      this.yearlyCancelled += r.cancelledDays || 0;
      this.yearlyPostponed += r.postponedDays || 0;
      this.yearlyMissed += r.missed || 0;
    }

    const max = Math.max(...this.reportHistory.map(r => r.totalAppointments || 0));
    const index = this.reportHistory.findIndex(r => (r.totalAppointments || 0) === max);
    this.busiestMonth = index >= 0 ? `شهر ${this.reportHistory[index].month}` : '--';
  }

getCurrentMonthName(month?: number): string {
  const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  const index = (month ?? (new Date().getMonth() + 1)) - 1;
  return months[index] ?? '--';
}


  getFallbackMonthlyData() {
    return { cancelledDays: 0, postponedDays: 0, attended: 0, missed: 0, totalAppointments: 0 };
  }

  getFallbackYearlyData() {
    return Array.from({ length: 12 }, () => ({
      totalAppointments: 0, cancelledDays: 0, postponedDays: 0, attended: 0, missed: 0
    }));
  }

  renderMonthChart(): void {
    if (!this.monthChartRef) return;

    this.monthChart?.destroy();
    const ctx = this.monthChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const { cancelledDays, postponedDays, attended, missed } = this.currentMonthReport;

    this.monthChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['ملغاة', 'مؤجلة', 'الحضور', 'الغياب'],
        datasets: [{
          label: 'إحصائيات الشهر',
          data: [cancelledDays, postponedDays, attended, missed],
          backgroundColor: ['#ef476f', '#ffd166', '#06d6a0', '#118ab2']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            rtl: true,
            callbacks: {
              label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { precision: 0 }
          }
        }
      }
    });
  }

  // ✅ تحميل بيانات شهر محدد من history فقط
  loadSelectedMonthFromHistory(month: number): void {
    const selectedReport = this.reportHistory.find(r => r.month === month);
    if (!selectedReport) return;

    this.currentMonthReport = selectedReport;
    this.currentMonthNumber = month;
    this.calculateAttendancePercentage();
    this.renderMonthChart();

    console.log("✅ عرض بيانات من reportHistory - شهر:", month);
  }

  renderYearChart(): void {
    if (!this.yearChartRef) return;

    this.yearChart?.destroy();
    const ctx = this.yearChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const data = this.reportHistory.map(r => r.totalAppointments || 0);
    const labels = this.reportHistory.map(r => `شهر ${r.month}`);

    this.yearChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          label: 'إجمالي الحجوزات',
          data,
          backgroundColor: [
            '#7b2cbf', '#3498db', '#2ecc71', '#f39c12', '#e74c3c',
            '#1abc9c', '#9b59b6', '#34495e', '#16a085', '#27ae60',
            '#2980b9', '#8e44ad'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            rtl: true,
            labels: {
              usePointStyle: true,
              padding: 15,
              font: { family: 'Tahoma, Arial, sans-serif' }
            }
          },
          tooltip: {
            rtl: true,
            callbacks: {
              label: (ctx) => `${ctx.label}: ${ctx.parsed}`
            }
          }
        },
        cutout: '60%'
      }
    });

    // ✅ عند الضغط على شهر معين
    this.yearChart.canvas.onclick = (event: MouseEvent) => {
      const points = this.yearChart?.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);
      if (points && points.length > 0) {
        const index = points[0].index;
        const selectedMonth = this.reportHistory[index]?.month;
        if (selectedMonth) {
          this.loadSelectedMonthFromHistory(selectedMonth);
        }
      }
    };
  }
}
