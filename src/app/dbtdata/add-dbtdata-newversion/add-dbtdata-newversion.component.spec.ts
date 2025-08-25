import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDbtdataNewversionComponent } from './add-dbtdata-newversion.component';

describe('AddDbtdataNewversionComponent', () => {
  let component: AddDbtdataNewversionComponent;
  let fixture: ComponentFixture<AddDbtdataNewversionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDbtdataNewversionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDbtdataNewversionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
