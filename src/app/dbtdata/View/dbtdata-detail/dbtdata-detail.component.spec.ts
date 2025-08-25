import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DbtdataDetailComponent } from './dbtdata-detail.component';

describe('DbtdataDetailComponent', () => {
  let component: DbtdataDetailComponent;
  let fixture: ComponentFixture<DbtdataDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DbtdataDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DbtdataDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
