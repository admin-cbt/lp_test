import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestBankComponent } from './test-bank.component';

describe('TestBankComponent', () => {
  let component: TestBankComponent;
  let fixture: ComponentFixture<TestBankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestBankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
