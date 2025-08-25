import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploaddataComponent } from './uploaddata.component';

describe('UploaddataComponent', () => {
  let component: UploaddataComponent;
  let fixture: ComponentFixture<UploaddataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploaddataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploaddataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
