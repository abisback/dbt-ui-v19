import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditApprovalSchemeComponent } from './edit-approval-scheme.component';

describe('EditApprovalSchemeComponent', () => {
  let component: EditApprovalSchemeComponent;
  let fixture: ComponentFixture<EditApprovalSchemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditApprovalSchemeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditApprovalSchemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
