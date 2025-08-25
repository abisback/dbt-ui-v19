import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisSchemeMonthDbtComponent } from './mis-scheme-month-dbt.component';

describe('MisSchemeMonthDbtComponent', () => {
  let component: MisSchemeMonthDbtComponent;
  let fixture: ComponentFixture<MisSchemeMonthDbtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisSchemeMonthDbtComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisSchemeMonthDbtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
