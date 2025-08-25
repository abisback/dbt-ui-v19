import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDbtComponent } from './edit-dbt.component';

describe('EditDbtComponent', () => {
  let component: EditDbtComponent;
  let fixture: ComponentFixture<EditDbtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditDbtComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDbtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
