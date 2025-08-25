import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmProcessDbtComponent } from './confirm-process-dbt.component';

describe('ConfirmProcessDbtComponent', () => {
  let component: ConfirmProcessDbtComponent;
  let fixture: ComponentFixture<ConfirmProcessDbtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmProcessDbtComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmProcessDbtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
