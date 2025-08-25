import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDbtdataNewformatComponent } from './add-dbtdata-newformat.component';

describe('AddDbtdataNewformatComponent', () => {
  let component: AddDbtdataNewformatComponent;
  let fixture: ComponentFixture<AddDbtdataNewformatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDbtdataNewformatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDbtdataNewformatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
