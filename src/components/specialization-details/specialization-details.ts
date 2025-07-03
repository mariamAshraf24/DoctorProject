import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { inject } from '@angular/core';
import { Admin } from '../../app/core/services/admin';
import { IAdmin } from '../../app/core/interfaces/iadmin';

@Component({
  selector: 'app-specialization-details',
  imports: [CommonModule,RouterLink],
  templateUrl: './specialization-details.html',
  styleUrl: './specialization-details.scss'
})
export class SpecializationDetails implements OnInit {
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _adminService = inject(Admin);

  detailsSpecialization: IAdmin | null = null ; // يجب تعديل هذا حسب نوع البيانات التي تتوقعها

  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe({
      next: (params) => {
        let idspecialization = params.get('id');
        if (idspecialization) {
          this._adminService.getSpecializationsById(idspecialization).subscribe({
            next: (res) => {
              this.detailsSpecialization = res.data;
            },
            error: (err) => {
              console.error('Error fetching specialization details:', err);
            }
          });
        } else {
          console.error('No specialization ID provided in route parameters.');
        }
        
      },
      error: (err) => {
        console.error('Error fetching route parameters:', err);
      }
    }); 
  }
}
