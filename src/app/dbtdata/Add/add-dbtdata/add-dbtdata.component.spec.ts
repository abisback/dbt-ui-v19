import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDbtdataComponent } from './add-dbtdata.component';

describe('AddDbtdataComponent', () => {
  let component: AddDbtdataComponent;
  let fixture: ComponentFixture<AddDbtdataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDbtdataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDbtdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
