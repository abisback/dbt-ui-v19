import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportOfPushDataComponent } from './report-of-push-data.component';

describe('ReportOfPushDataComponent', () => {
  let component: ReportOfPushDataComponent;
  let fixture: ComponentFixture<ReportOfPushDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportOfPushDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportOfPushDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
