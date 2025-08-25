import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DbtdataComponent } from './dbtdata.component';

describe('DbtdataComponent', () => {
  let component: DbtdataComponent;
  let fixture: ComponentFixture<DbtdataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DbtdataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DbtdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
