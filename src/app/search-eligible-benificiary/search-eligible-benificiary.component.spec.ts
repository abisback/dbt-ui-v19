import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchEligibleBenificiaryComponent } from './search-eligible-benificiary.component';

describe('SearchEligibleBenificiaryComponent', () => {
  let component: SearchEligibleBenificiaryComponent;
  let fixture: ComponentFixture<SearchEligibleBenificiaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchEligibleBenificiaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchEligibleBenificiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
