import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendedDbtDataComponent } from './extended-dbt-data.component';

describe('ExtendedDbtDataComponent', () => {
  let component: ExtendedDbtDataComponent;
  let fixture: ComponentFixture<ExtendedDbtDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExtendedDbtDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtendedDbtDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
