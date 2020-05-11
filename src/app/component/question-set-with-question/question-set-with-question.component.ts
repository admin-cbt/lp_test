import { Component, OnInit } from '@angular/core';
import { queSetWithQuestions } from '../../models/queSetWithQuestions.model'
import { DalService } from 'src/app/services/dal.service';
import * as $ from "jquery";
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-question-set-with-question',
  templateUrl: './question-set-with-question.component.html',
  styleUrls: ['./question-set-with-question.component.css']
})
export class QuestionSetWithQuestionComponent implements OnInit {
  public questionSetWithQuestions: queSetWithQuestions;
  constructor(public dal: DalService, private route: ActivatedRoute, private router: Router) {
    this.questionSetWithQuestions = new queSetWithQuestions();
  }
  allQuestionSets: any;
  allQuestions: any;
  setQuestionsId: any;

  ngOnInit() {
    //get set questions with set id
    this.route.params.subscribe(x => {
      this.questionSetWithQuestions.questionPaperSetId = x.id;
      this.dal.getAllSetQuestionsWithSetId(x.id).subscribe(y => {
        this.setQuestionsId = y.questions.map(x => x.questions.questionId);
        //this.setMetaData = y.questionPaperSetInfo;
        //console.log("set question ids", y.questions, this.setQuestionsId);
      })
    })
    // this.getAllSetList();
    this.getAllQuestions();
  }

  selectedQuestions: any;
  // for getting checked list from questions component i.e. child component
  checkedQuestionList(event) {
    this.selectedQuestions = event;
    ////console.log("checked data from child", event);
  }

  //for getting all set list
  getAllSetList() {
    this.dal.getAllSetList(parseInt(localStorage.getItem('userId'))).subscribe(x => {
      this.allQuestionSets = x.questionSets;
      ////console.log("all set list", x)
    })
  }

  filterData = {
    classForFilter: [],
    subjectForFilter: [],
    difficultyLevel: [],
    questionType: [],
    timeToSolve: []
  }

  //for getting all question list
  getAllQuestions() {
    this.dal.getAllQuestions(parseInt(localStorage.getItem('userId'))).subscribe(x => {
      this.allQuestions = x.questions;


      if (this.setQuestionsId) {
        this.allQuestions = this.allQuestions.filter(val => !this.setQuestionsId.includes(val.questionId));
      }
      //console.log("all questions filtered", this.allQuestions)
      this.filterData.classForFilter = this.dal.removeDuplicates(x.questions.map(x => {
        return { className: x.classInfo.className, classId: x.classInfo.classId }
      }), "classId");

      this.filterData.subjectForFilter = this.dal.removeDuplicates(x.questions.map(x => {
        return { subjectName: x.subjectInfo.subjectName, subjectId: x.subjectInfo.subjectId }
      }), "subjectId");

      this.filterData.difficultyLevel = this.dal.removeDuplicates(x.questions.map(x => {
        return { difficultyLevel: x.difficultyLevel }
      }), "difficultyLevel");

      this.filterData.questionType = this.dal.removeDuplicates(x.questions.map(x => {
        return { questionType: x.questionType }
      }), "questionType");

      this.filterData.timeToSolve = this.dal.removeDuplicates(x.questions.map(x => {
        return { timeToSolve: x.timeToSolve }
      }), "timeToSolve");
      ////console.log("all questions", x.questions)
    })
  }

  questionIds: any;
  questionSetError: boolean = false;
  questionError: boolean = false;

  //for adding question set with question
  saveQuestionSet(data) {
    this.questionSetError = false;
    this.questionError = false;
    if (data.questionPaperSetId == undefined) {
      //alert("select set id");
      this.questionSetError = true;
    } else {
      this.questionSetError = false;
      if (!this.selectedQuestions) {
        //alert("select questions");
        this.questionError = true;

      } else {
        this.questionError = false;
        // ////console.log("selected que ids",this.questionIds)
        if (this.selectedQuestions.length == 0) {
          this.questionError = true;
          return
        }
        let questions = this.selectedQuestions.map(x => {
          return { "questionId": x.questionId }
        })

        ////console.log("selected que ids after transform", questions)
        this.questionSetWithQuestions.questionPaperSetId = parseInt(data.questionPaperSetId);
        this.questionSetWithQuestions.questions = questions;
        ////console.log("selected question for save", this.questionSetWithQuestions);

        this.dal.saveQuestionPaperSetWithQuestions(this.questionSetWithQuestions).subscribe(x => {
          if (x.status == "success") {
            this.router.navigateByUrl(`question-set-details/${this.questionSetWithQuestions.questionPaperSetId}`)
            ////console.log("question set with que saves success", x);
            Swal.fire({
              icon: 'success',
              title: "Success!",
              text: "Question set with question added successfully!",
              timer: 3000
            })
          } else {
            Swal.fire({
              icon: 'error',
              title: "Error!",
              text: x.message,
              timer: 3000
            })
          }


        })
      }

    }

  }


  setQuestionsBySetId: any;

  //for update set
  updateSet(setId) {
    this.removeQuestionError = false;
    // ////console.log("update set data",setId)
    this.dal.getAllSetQuestionsWithSetId(setId).subscribe(x => {
      if (x.status == "success") {
        this.setQuestionsBySetId = x.questions;
        ////console.log("question list by set id", x.questions)

      } else {
        Swal.fire({
          icon: 'error',
          title: 'error',
          text: x.message,
          timer: 3000
        })
      }

    })
  }

  questionIdForRemove: any
  removeQuestionError: boolean = false;
  // for remove question
  removeQuestions() {
    this.removeQuestionError = false;
    if (this.questionIdForRemove == undefined || !this.questionIdForRemove.length) {
      //alert("select questions for remove");
      this.removeQuestionError = true;
    } else {
      this.removeQuestionError = false;
      let queSetIds = this.questionIdForRemove.map(x => {
        return { 'testQuestionSetId': x }
      })
      let payload = {
        testQuestionSetIds: queSetIds
      }
      this.dal.removeQuestionsFromSet(payload).subscribe(x => {
        if (x.status == "success") {
          // this.getAllSetList();


          this.questionIdForRemove = [];
          ////console.log("question removed success", x);
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: x.message,
            timer: 3000
          })
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: x.message,
            timer: 3000
          })
        }
      })

    }
  }

}
