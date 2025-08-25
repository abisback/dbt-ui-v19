import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessDbtComponent } from './process-dbt.component';

describe('ProcessDbtComponent', () => {
  let component: ProcessDbtComponent;
  let fixture: ComponentFixture<ProcessDbtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcessDbtComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessDbtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
