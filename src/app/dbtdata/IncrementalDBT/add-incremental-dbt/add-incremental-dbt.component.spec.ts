import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIncrementalDbtComponent } from './add-incremental-dbt.component';

describe('AddIncrementalDbtComponent', () => {
  let component: AddIncrementalDbtComponent;
  let fixture: ComponentFixture<AddIncrementalDbtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddIncrementalDbtComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddIncrementalDbtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
