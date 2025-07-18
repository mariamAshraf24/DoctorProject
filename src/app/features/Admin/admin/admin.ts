import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { Admin } from '../../../core/services/admin';
import { IAdmin } from '../../../core/models/IAdmin';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class AdminComponent implements OnInit {
  private readonly _authService = inject(Auth);
  private readonly _router = inject(Router);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  // دالة تسجيل الخروج
  logout(): void {
    this._authService.logout();
    this._router.navigate(['/login']);
  }

  // فتح مودال التعديل مع تعبئة البيانات
  openEditModal(s: IAdmin): void {
    this.editSpecializationData = { ...s };
    this.editNameError = '';
    setTimeout(() => {
      const modalEl = document.getElementById('editModal');
      if (modalEl) {
        // @ts-ignore
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.show();
      }
    }, 0);
  }

  // إعادة تعيين بيانات مودال التعديل
  resetEditModal(): void {
    this.editSpecializationData = { id: '', name: '', doctors: [] };
    this.editNameError = '';
  }

  // تحقق فوري من صحة اسم التخصص عند التعديل
  validateEditSpecializationName(): void {
    const name = this.editSpecializationData.name?.trim();
    if (!name) {
      this.editNameError = 'الاسم مطلوب';
      return;
    }
    if (name.length < 3) {
      this.editNameError = 'يجب ألا يقل الاسم عن 3 أحرف';
      return;
    }
    const exists = this.specializations.some(
      spec => spec.name.trim().toLowerCase() === name.toLowerCase() && spec.id !== this.editSpecializationData.id
    );
    if (exists) {
      this.editNameError = 'هذا التخصص موجود بالفعل!';
      return;
    }
    this.editNameError = '';
  }

  // تنفيذ التعديل
  updateSpecialization(): void {
    this.validateEditSpecializationName();
    const { id, name } = this.editSpecializationData;
    if (this.editNameError || !name || name.trim().length < 3) {
      return;
    }
    this._adminService.updateSpecialization(id, name.trim()).subscribe({
      next: () => {
        // ابحث عن العنصر القديم
        const idx = this.specializations.findIndex(s => s.id === id);
        if (idx !== -1) {
          // احذف العنصر القديم
          const old = this.specializations.splice(idx, 1)[0];
          // أنشئ العنصر المعدل
          const updated = { ...old, name: name.trim() };
          // أدرجه في المكان الصحيح أبجدياً
          let insertIdx = this.specializations.findIndex(
            s => s.name.localeCompare(updated.name, 'ar', { sensitivity: 'base' }) > 0
          );
          if (insertIdx === -1) {
            this.specializations.push(updated);
          } else {
            this.specializations.splice(insertIdx, 0, updated);
          }
        }
        this.filterSpecializations();
        const modalEl = document.getElementById('editModal');
        if (modalEl) {
          // @ts-ignore
          const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
          modal.hide();
        }
        this.resetEditModal();
        this.showToast('تم تعديل التخصص بنجاح');
      },
      error: (err: any) => {
        alert('حدث خطأ أثناء تعديل التخصص');
        console.error(err);
      }
    });
  }


  editSpecializationData = { id: '', name: '', doctors: [] };
  editNameError: string = '';

  resetModal(): void {
    this.newSpecialization = { id: '', name: '', doctors: [] };
    this.nameError = '';
  }
  nameError: string = '';
  private readonly _adminService = inject(Admin);

  specializations: IAdmin[] = [];
  filteredSpecializations: IAdmin[] = [];

  searchText = '';
  totalSpecializations = 0;


  newSpecialization: IAdmin = {
    id: "",
    name: '',
    doctors: []
  };
  validateSpecializationName(): void {
    const name = this.newSpecialization.name?.trim();
    if (!name) {
      this.nameError = 'الاسم مطلوب';
      return;
    }
    if (name.length < 3) {
      this.nameError = 'يجب ألا يقل الاسم عن 3 أحرف';
      return;
    }
    const exists = this.specializations.some(
      spec => spec.name.trim().toLowerCase() === name.toLowerCase()
    );
    if (exists) {
      this.nameError = 'هذا التخصص موجود بالفعل!';
      return;
    }
    this.nameError = '';
  }

  ngOnInit(): void {
    this._adminService.getAllSpecializations().subscribe({
      next: (res: any) => {
        this.specializations = res.data;
        this.totalSpecializations = this.specializations.length;
        this.filteredSpecializations = [...this.specializations];
      },
      error: (err: any) => {
        console.error('Error fetching specializations:', err);
      }
    });

    setTimeout(() => {
      const modalEl = document.getElementById('addModal');
      if (modalEl) {
        modalEl.addEventListener('hidden.bs.modal', () => {
          this.resetModal();
        });
      }
      const editModalEl = document.getElementById('editModal');
      if (editModalEl) {
        editModalEl.addEventListener('hidden.bs.modal', () => {
          this.resetEditModal();
        });
      }
    }, 0);
  }

  showDeleteDialog = false;
  specializationToDeleteId: string | null = null;

  openDeleteDialog(id: string) {
    this.specializationToDeleteId = id;
    this.showDeleteDialog = true;
  }

  closeDeleteDialog() {
    this.showDeleteDialog = false;
    this.specializationToDeleteId = null;
  }

  confirmDelete() {
    if (!this.specializationToDeleteId) return;
    this._adminService.deleteSpecialization(this.specializationToDeleteId).subscribe({
      next: (res: any) => {
        this.specializations = this.specializations.filter((s: IAdmin) => s.id !== this.specializationToDeleteId);
        this.filteredSpecializations = this.filteredSpecializations.filter((s: IAdmin) => s.id !== this.specializationToDeleteId);
        this.totalSpecializations = this.specializations.length;
        this.showToast('تم حذف التخصص بنجاح');
      },
      error: (err: any) => {
        alert('حدث خطأ أثناء حذف التخصص');
        console.error(err);
      },
      complete: () => {
        this.closeDeleteDialog();
      }
    });
  }


  filterSpecializations(): void {
    this.filteredSpecializations = this.specializations.filter(s =>
      s.name.includes(this.searchText)
    );
  }

  clearFilters(): void {
    this.searchText = '';
    this.filterSpecializations();
  }


  loadData(): void { }


  addSpecialization(): void {
    this.validateSpecializationName();
    if (this.nameError || !this.newSpecialization.name?.trim()) {
      const modalEl = document.getElementById('addModal');
      if (modalEl) {
        // @ts-ignore
        const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        modal.hide();
      }
      this.resetModal();
      return;
    }
    this._adminService.addSpecialization(this.newSpecialization.name.trim()).subscribe({
      next: (res) => {
        // أضف التخصص الجديد في المكان الصحيح أبجدياً بدون refresh كامل
        const newSpec = { ...res.data };
        let insertIdx = this.specializations.findIndex(
          s => s.name.localeCompare(newSpec.name, 'ar', { sensitivity: 'base' }) > 0
        );
        if (insertIdx === -1) {
          this.specializations.push(newSpec);
        } else {
          this.specializations.splice(insertIdx, 0, newSpec);
        }
        this.filterSpecializations();
        const modalEl = document.getElementById('addModal');
        if (modalEl) {
          // استخدمي دوال Bootstrap الرسمية
          // @ts-ignore
          const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
          modal.hide();
        }
        // أجبري Angular على تحديث الـ View
        this.cdr.detectChanges();
        // إزالة كل آثار المودال والـ overlay فورًا بعد إغلاق المودال
        setTimeout(() => {
          document.body.classList.remove('modal-open');
          document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());
          document.querySelectorAll('.modal.show').forEach(m => m.classList.remove('show'));
          document.querySelectorAll('.modal').forEach(m => {
            (m as HTMLElement).style.display = 'none';
            (m as HTMLElement).setAttribute('aria-hidden', 'true');
          });
          (document.activeElement as HTMLElement)?.blur();
          const tableResponsive = document.querySelector('.table-responsive');
          if (tableResponsive) {
            (tableResponsive as HTMLElement).style.overflowY = 'hidden';
            void (tableResponsive as HTMLElement).offsetHeight;
            (tableResponsive as HTMLElement).style.overflowY = 'auto';
          }
        }, 100);
        this.resetModal();
        this.showToast('تمت إضافة التخصص بنجاح');
      },
      error: (err) => {
        alert('حدث خطأ أثناء إضافة التخصص');
        console.error(err);
      }
    });
  }

  toastMessage: string = '';

  showToast(message: string): void {
    this.toastMessage = message;
    setTimeout(() => {
      const toastEl = document.getElementById('actionToast');
      if (toastEl) {
        // @ts-ignore
        const toast = bootstrap.Toast.getOrCreateInstance(toastEl);
        toast.show();
      }
    }, 0);
  }
}

