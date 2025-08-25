import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveSchemeComponent } from './approve-scheme.component';

describe('ApproveSchemeComponent', () => {
  let component: ApproveSchemeComponent;
  let fixture: ComponentFixture<ApproveSchemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApproveSchemeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproveSchemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
