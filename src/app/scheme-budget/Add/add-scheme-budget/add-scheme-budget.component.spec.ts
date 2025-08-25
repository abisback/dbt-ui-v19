import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSchemeBudgetComponent } from './add-scheme-budget.component';

describe('AddSchemeBudgetComponent', () => {
  let component: AddSchemeBudgetComponent;
  let fixture: ComponentFixture<AddSchemeBudgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSchemeBudgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSchemeBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
