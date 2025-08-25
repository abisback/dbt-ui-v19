import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BenifitMatrixNewComponent } from './benifit-matrix-new.component';

describe('BenifitMatrixNewComponent', () => {
  let component: BenifitMatrixNewComponent;
  let fixture: ComponentFixture<BenifitMatrixNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BenifitMatrixNewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BenifitMatrixNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
