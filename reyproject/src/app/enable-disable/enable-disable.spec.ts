import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnableDisable } from './enable-disable';

describe('EnableDisable', () => {
  let component: EnableDisable;
  let fixture: ComponentFixture<EnableDisable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnableDisable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnableDisable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
