import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecializationDetails } from './specialization-details';

describe('SpecializationDetails', () => {
  let component: SpecializationDetails;
  let fixture: ComponentFixture<SpecializationDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecializationDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecializationDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
