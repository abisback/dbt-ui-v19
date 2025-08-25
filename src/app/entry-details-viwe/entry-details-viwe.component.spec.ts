import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryDetailsViweComponent } from './entry-details-viwe.component';

describe('EntryDetailsViweComponent', () => {
  let component: EntryDetailsViweComponent;
  let fixture: ComponentFixture<EntryDetailsViweComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntryDetailsViweComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntryDetailsViweComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
