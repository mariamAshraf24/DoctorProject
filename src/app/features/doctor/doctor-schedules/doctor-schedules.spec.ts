import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorSchedules } from './doctor-schedules';

describe('DoctorSchedules', () => {
  let component: DoctorSchedules;
  let fixture: ComponentFixture<DoctorSchedules>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorSchedules]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorSchedules);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
