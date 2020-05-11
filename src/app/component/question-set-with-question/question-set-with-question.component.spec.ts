import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionSetWithQuestionComponent } from './question-set-with-question.component';

describe('QuestionSetWithQuestionComponent', () => {
  let component: QuestionSetWithQuestionComponent;
  let fixture: ComponentFixture<QuestionSetWithQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionSetWithQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionSetWithQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
