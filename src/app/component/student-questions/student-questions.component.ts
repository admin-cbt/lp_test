import { Component, OnInit } from '@angular/core';
import { DalService } from 'src/app/services/dal.service';

@Component({
  selector: 'app-student-questions',
  templateUrl: './student-questions.component.html',
  styleUrls: ['./student-questions.component.css']
})
export class StudentQuestionsComponent implements OnInit {

  constructor(public dal: DalService) { }

  ngOnInit() {
    this.getAllQuestions();
  }

  studentQuestionSets: any;

  // for getting all questons for student
  getAllQuestions() {
    this.dal.getallQuestionsByStudentId(parseInt(localStorage.getItem('userId'))).subscribe(x => {
      this.studentQuestionSets = this.dal.removeDuplicates(x.studentQuestions, "questionPaperSetId");

      //console.log("questions by student id", x)
    })
  }

}
