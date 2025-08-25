import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BenifitMatrixComponent } from './benifit-matrix.component';

describe('BenifitMatrixComponent', () => {
  let component: BenifitMatrixComponent;
  let fixture: ComponentFixture<BenifitMatrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BenifitMatrixComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BenifitMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
