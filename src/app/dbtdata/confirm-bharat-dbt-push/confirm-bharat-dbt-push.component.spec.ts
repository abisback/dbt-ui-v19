import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmBharatDbtPushComponent } from './confirm-bharat-dbt-push.component';

describe('ConfirmBharatDbtPushComponent', () => {
  let component: ConfirmBharatDbtPushComponent;
  let fixture: ComponentFixture<ConfirmBharatDbtPushComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmBharatDbtPushComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmBharatDbtPushComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
