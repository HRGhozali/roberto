import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchData } from './search-data';

describe('SearchData', () => {
  let component: SearchData;
  let fixture: ComponentFixture<SearchData>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchData]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchData);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
