import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeWiseMonthlyStatusComponent } from './scheme-wise-monthly-status.component';

describe('SchemeWiseMonthlyStatusComponent', () => {
  let component: SchemeWiseMonthlyStatusComponent;
  let fixture: ComponentFixture<SchemeWiseMonthlyStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchemeWiseMonthlyStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchemeWiseMonthlyStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
