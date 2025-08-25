import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisSchemeWiseBeneficiaryComponent } from './mis-scheme-wise-beneficiary.component';

describe('MisSchemeWiseBeneficiaryComponent', () => {
  let component: MisSchemeWiseBeneficiaryComponent;
  let fixture: ComponentFixture<MisSchemeWiseBeneficiaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisSchemeWiseBeneficiaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisSchemeWiseBeneficiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
