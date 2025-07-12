import { TestBed } from '@angular/core/testing';

import { DoctorSchedulesService } from './doctor-schedules';

describe('DoctorSchedules', () => {
  let service: DoctorSchedulesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DoctorSchedulesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
