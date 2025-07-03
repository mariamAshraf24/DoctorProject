import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentsByDate } from './appointments-by-date';

describe('AppointmentsByDate', () => {
  let component: AppointmentsByDate;
  let fixture: ComponentFixture<AppointmentsByDate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentsByDate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentsByDate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
