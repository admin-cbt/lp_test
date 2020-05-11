import { Component, OnInit } from '@angular/core';
import { DalService } from 'src/app/services/dal.service';
import Swal from 'sweetalert2';
//import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { UpdatedQuestion } from "../../models/updateQuestion.model";


@Component({
  selector: 'app-question-bank',
  templateUrl: './question-bank.component.html',
  styleUrls: ['./question-bank.component.css']
})
export class QuestionBankComponent implements OnInit {
  dropdownClassSettings = {
    singleSelection: true,
    idField: 'classId',
    textField: 'className',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };

  dropdownBoardSettings = {
    singleSelection: true,
    idField: 'boardId',
    textField: 'boardName',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };

  dropdownSubjectSettings = {
    singleSelection: true,
    idField: 'subjectId',
    textField: 'subjectName',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };

  public questionToUpdate: UpdatedQuestion;
  constructor(public dal: DalService) {
    this.questionToUpdate = new UpdatedQuestion();
  }
  allQuestions: any
  question: any;
  classList: any;
  subjectList: any;
  boardList: any;
  questionType = ["tof", "mcq", "single select"];
  difficultyLevel = ["easy", "medium", "hard"];
  checkedQuestionList: any;

  ngOnInit() {
    this.getAllQuestions();
    //this.getCcMetaData();
  }
  filterData = {
    classForFilter: [],
    subjectForFilter: [],
    difficultyLevel: [],
    questionType: [],
    timeToSolve: []
  }

  // question updated event
  questionUpdated(event) {
    if (event == true) {
      ////console.log("question updated event");
      this.getAllQuestions();
    }
  }

  // delete image event
  imageDeleted(event) {
    if (event == true) {
      ////console.log("image deleted event");
      this.getAllQuestions();
    }
  }

  // image updated event
  imageUpdated(event) {
    if (event == true) {
      ////console.log("image updated event");
      this.getAllQuestions();
    }
  }

  // page change event
  pageChanged(event) {
    //console.log("page change from child", event);
    this.getQuestionWithQuery(event, 20);
  }

  // to get all questions list
  getAllQuestions() {
    this.dal.getAllQuestions(parseInt(localStorage.getItem('userId'))).subscribe(x => {
      this.allQuestions = x.questions;
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

      // ////console.log("all questions",x.questions)
    })
  }

  // for get questions for http paginations
  getQuestionWithQuery(pageNo, pageSize) {
    this.dal.getAllQuestionsWithQuery(parseInt(localStorage.getItem('userId')), pageNo, pageSize).subscribe(x => {
      //console.log("queried data for page", pageNo, " and page size ", pageSize, " is ", x)
      this.allQuestions = x.questions;
    })
  }



  // for getting cc meta data
  getCcMetaData() {
    this.dal.getCCMetaData(parseInt(localStorage.getItem('userId'))).subscribe(x => {
      ////console.log("cc meta data", x);
      this.classList = x.classInfo;
      this.boardList = x.boardInfo;
      this.subjectList = x.subjectInfo;
      //this.questionType = x.distictQuestionType;
    })
  }


  // for fetting questions by id using click event
  getQuestionById(data) {
    this.questionToUpdate.questionId = data.questionId;
    this.questionToUpdate.question = data.question;
    this.questionToUpdate.isImageAvailable = data.isImageAvailable;
    this.questionToUpdate.imageUrl = data.imageUrl || "";
    this.questionToUpdate.questionType = data.questionType;
    this.questionToUpdate.difficultyLevel = data.difficultyLevel;
    this.questionToUpdate.maximumMarks = data.maximumMarks;
    this.questionToUpdate.timeToSolve = data.timeToSolve;
    this.questionToUpdate.isOptionAvailable = data.isOptionAvailable;
    this.questionToUpdate.subjectInformation = data.subjectInfo.subjectId;
    this.questionToUpdate.classInformation = data.classInfo.classId;
    this.questionToUpdate.boardInformation = data.boardInfo.boardId;
    this.questionToUpdate.options = data.options;
    this.questionToUpdate.ccInformation = parseInt(localStorage.getItem('userId'));
    ////console.log("question data by id", this.questionToUpdate);
  }

  onSubjectSelect(event, data) {
    data = event;
    ////console.log("on subject select", event)
  }

  onClassSelect(event) {
    //UpdatedQuestion.classInfo = event
    ////console.log("on class select", event)
  }

  onBoardSelect(event) {
    ////console.log("on board select", event)
  }

  // question update question
  updateQuestion(data, isValid, form) {
    ////console.log("isForm valid : ", isValid);
    if (!isValid) return;
    this.questionToUpdate.questionId = data.questionId;
    this.questionToUpdate.question = data.question;
    this.questionToUpdate.isImageAvailable = data.isImageAvailable;
    this.questionToUpdate.imageUrl = data.imageUrl || "";
    this.questionToUpdate.questionType = data.questionType;
    this.questionToUpdate.difficultyLevel = data.difficultyLevel;
    this.questionToUpdate.maximumMarks = data.maximumMarks;
    this.questionToUpdate.timeToSolve = data.timeToSolve;
    this.questionToUpdate.isOptionAvailable = data.isOptionAvailable;
    this.questionToUpdate.subjectInformation = parseInt(data.subjectInformation);
    this.questionToUpdate.classInformation = parseInt(data.classInformation);
    this.questionToUpdate.boardInformation = parseInt(data.boardInformation);
    this.questionToUpdate.options = data.options;
    this.questionToUpdate.ccInformation = parseInt(localStorage.getItem('userId'));
    //////console.log("updated question",this.questionToUpdate);

    this.dal.updateQuestion(data).subscribe(x => {

      if (x.status == "success") {
        //form.resetForm();
        ////console.log("question updated success", x);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: x.message,
          timer: 3000
        })
        this.getAllQuestions();
      }
    })

  }

  // add row for options
  // addRow() {
  //   let opt = { optionName: "", isCorrectAnswer: false }
  //   this.questionToUpdate.options.push(opt);
  // }

  // addPairRow() {
  //   let opt = { optionName: "", isCorrectAnswer: false }
  //   this.questionToUpdate.options.push(opt);
  // }

}
