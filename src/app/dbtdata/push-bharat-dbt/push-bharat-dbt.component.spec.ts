import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PushBharatDbtComponent } from './push-bharat-dbt.component';

describe('PushBharatDbtComponent', () => {
  let component: PushBharatDbtComponent;
  let fixture: ComponentFixture<PushBharatDbtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PushBharatDbtComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PushBharatDbtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
