import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeBudgetComponent } from './scheme-budget.component';

describe('SchemeBudgetComponent', () => {
  let component: SchemeBudgetComponent;
  let fixture: ComponentFixture<SchemeBudgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchemeBudgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchemeBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
