import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentWiseMisReportComponent } from './department-wise-mis-report.component';

describe('DepartmentWiseMisReportComponent', () => {
  let component: DepartmentWiseMisReportComponent;
  let fixture: ComponentFixture<DepartmentWiseMisReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentWiseMisReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartmentWiseMisReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
