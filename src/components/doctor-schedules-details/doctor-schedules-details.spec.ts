import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorSchedulesDetails } from './doctor-schedules-details';

describe('DoctorSchedulesDetails', () => {
  let component: DoctorSchedulesDetails;
  let fixture: ComponentFixture<DoctorSchedulesDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorSchedulesDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorSchedulesDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
