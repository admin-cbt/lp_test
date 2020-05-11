import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './component/landing/landing.component';
import { HomeComponent } from './component/home/home.component';
import { TestBankComponent } from './component/test-bank/test-bank.component';
import { QuestionBankComponent } from './component/question-bank/question-bank.component';
import { CreateQuestionComponent } from './component/create-question/create-question.component';
import { QuestionSetComponent } from './component/question-set/question-set.component';
import { QuestionSetWithQuestionComponent } from './component/question-set-with-question/question-set-with-question.component';
import { LoginAuthService } from '../app/authGuards/login-auth.service'
import { AssignStudentComponent } from './component/assign-student/assign-student.component';
import { QuestionSetDetailsComponent } from './component/question-set-details/question-set-details.component';
import { StudentQuestionsComponent } from './component/student-questions/student-questions.component';

const routes: Routes = [
  { path: "", component: LandingComponent },
  { path: "home", canActivate: [LoginAuthService], component: HomeComponent },
  { path: "test-bank", canActivate: [LoginAuthService], component: TestBankComponent },
  { path: "question-bank", canActivate: [LoginAuthService], component: QuestionBankComponent },
  { path: "create-question", canActivate: [LoginAuthService], component: CreateQuestionComponent },

  { path: "question-set", canActivate: [LoginAuthService], component: QuestionSetComponent },
  { path: "question-set-with-questions/:id", canActivate: [LoginAuthService], component: QuestionSetWithQuestionComponent },
  { path: "assign-students", canActivate: [LoginAuthService], component: AssignStudentComponent },
  { path: "question-set-details/:id", canActivate: [LoginAuthService], component: QuestionSetDetailsComponent },
  { path: "student-questions", canActivate: [LoginAuthService], component: StudentQuestionsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
