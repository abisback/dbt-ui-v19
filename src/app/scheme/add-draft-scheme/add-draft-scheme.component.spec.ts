import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDraftSchemeComponent } from './add-draft-scheme.component';

describe('AddDraftSchemeComponent', () => {
  let component: AddDraftSchemeComponent;
  let fixture: ComponentFixture<AddDraftSchemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDraftSchemeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDraftSchemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
