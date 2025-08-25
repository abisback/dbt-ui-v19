import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBeneficiaryComponent } from './search-beneficiary.component';

describe('SearchBeneficiaryComponent', () => {
  let component: SearchBeneficiaryComponent;
  let fixture: ComponentFixture<SearchBeneficiaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBeneficiaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchBeneficiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
