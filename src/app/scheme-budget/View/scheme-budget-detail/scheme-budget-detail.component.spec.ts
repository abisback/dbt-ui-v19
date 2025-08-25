import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeBudgetDetailComponent } from './scheme-budget-detail.component';

describe('SchemeBudgetDetailComponent', () => {
  let component: SchemeBudgetDetailComponent;
  let fixture: ComponentFixture<SchemeBudgetDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchemeBudgetDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchemeBudgetDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
