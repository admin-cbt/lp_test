import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './component/landing/landing.component';
import { HomeComponent } from './component/home/home.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { HttpClientModule } from '@angular/common/http';
import { QuestionBankComponent } from './component/question-bank/question-bank.component';
import { TestBankComponent } from './component/test-bank/test-bank.component';
import { CreateQuestionComponent } from './component/create-question/create-question.component';
import { FormsModule } from '@angular/forms'
import { ChecklistModule } from 'angular-checklist';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { QuestionSetComponent } from './component/question-set/question-set.component';
import { QuestionSetWithQuestionComponent } from './component/question-set-with-question/question-set-with-question.component';
import { AssignStudentComponent } from './component/assign-student/assign-student.component';
import { QuestionsComponent } from './component/questions/questions.component';
import { QuestionSetDetailsComponent } from './component/question-set-details/question-set-details.component';
import { StudentQuestionsComponent } from './component/student-questions/student-questions.component';
import { ChartsModule } from 'ng2-charts';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormBuilder, FormGroup } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    HomeComponent,
    NavbarComponent,
    QuestionBankComponent,
    TestBankComponent,
    CreateQuestionComponent,
    QuestionSetComponent,
    QuestionSetWithQuestionComponent,
    AssignStudentComponent,
    QuestionsComponent,
    QuestionSetDetailsComponent,
    StudentQuestionsComponent
  ],
  imports: [
    NgMultiSelectDropDownModule.forRoot(),
    BrowserModule,
    ChecklistModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ChartsModule,
    NgxPaginationModule,

  ],
  providers: [FormBuilder],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
