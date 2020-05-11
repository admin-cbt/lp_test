import { Component, OnInit } from '@angular/core';
import { DalService } from 'src/app/services/dal.service';
import { QuestionSet } from '../../models/questionSet.model';
import { setUpdate } from '../../models/setUpdate.model';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-question-set',
  templateUrl: './question-set.component.html',
  styleUrls: ['./question-set.component.css']
})
export class QuestionSetComponent implements OnInit {

  public questionSetToAdd: QuestionSet;
  public setToUpdate: setUpdate;
  selectedQuestions: any;
  questionError: any;
  
  constructor(public dal: DalService) {
    this.setToUpdate = new setUpdate();
    this.questionSetToAdd = new QuestionSet();
  }
  //setToUpdate : any;

  ngOnInit() {
    //this.getAllSetList();
    // this.getAllClasses();
    // this.getAllBoards();
    // this.getAllSubjects();
    // this.getCcMetaData();
    this.getAllQuestions();
    this.getCBS();
  }

  // event listened by questions component for getting checked questions
  checkedQuestionList(event) {
    this.selectedQuestions = event;
    ////console.log("checked data from child", event);
  }


  allQuestionSets: any;
  subjectList: any;
  boardList: any;
  classList: any;
  questionType = ["tof", "mcq", "single select"];

  // for getting cc meta data
  getCcMetaData() {
    this.dal.getCCMetaData(parseInt(localStorage.getItem('userId'))).subscribe(x => {
      ////console.log("cc meta data", x);
      // this.classList = x.classInfo;
      //this.boardList = x.boardInfo;
      //this.subjectList = x.subjectInfo;
      this.questionType = x.distictQuestionType;
    })
  }

  // for getting global subject list
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

  // for getting all questions list
  getAllQuestions() {
    this.dal.getAllQuestions(parseInt(localStorage.getItem('userId'))).subscribe(x => {
      this.questionSetToAdd.que = x.questions;
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

      ////console.log("all questions", x.questions, this.filterData);
    })
  }




  // for adding question set
  addQuestionSet(data, isValid, form, selectedQuestions) {
    ////console.log("is form valid : ", isValid)
    if (!isValid) return

    if (!selectedQuestions) {
      alert("No questions selected")
    } else {
      let data1 = JSON.parse(JSON.stringify(data));
      data1.questions = selectedQuestions.map(x => {
        return { questionId: x.questionId }

      })

      data1.classInformation = parseInt(data.classInformation);
      data1.boardInformation = parseInt(data.boardInformation);
      data1.subjectInformation = parseInt(data.subjectInformation);
      data1.ccInformation = parseInt(localStorage.getItem('userId'));
      ////console.log("data", data1);

      this.dal.saveQuestionPaperSet(data1).subscribe(x => {
        if (x.status == "success") {
          this.getAllQuestions();
          this.selectedQuestions = null;
          form.resetForm();
          ////console.log("set saved success!", x);
          this.questionSetToAdd = new QuestionSet();
          Swal.fire({
            icon: 'success',
            title: "Success!",
            text: "Question set added successfully!",
            timer: 3000
          })
          //this.getAllSetList();
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

  // for removing question set
  removeQuestionSet(id) {
    ////console.log("set id for remove", id);
    Swal.fire({
      title: 'Are you sure want to delete set?',
      text: 'You will not be able to recover this set!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) {
        this.dal.removeQuestionPaperSet(id).subscribe(x => {
          // this.getAllSetList();
          if (x.status == "success") {
            Swal.fire({
              icon: 'success',
              title: "Success!",
              text: x.message,
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
    })
  }
  // for getting data for update by click event
  updateDataById(data) {
    this.setToUpdate.questionPaperSetId = data.questionPaperSetId
    this.setToUpdate.setName = data.setName
    this.setToUpdate.paperTime = data.paperTime
    this.setToUpdate.totalMark = data.totalMark
    this.setToUpdate.subjectInformation = parseInt(data.subjectInfo.subjectId);
    this.setToUpdate.classInformation = parseInt(data.classInfo.classId);
    this.setToUpdate.boardInformation = parseInt(data.boardInfo.boardId);
    this.setToUpdate.ccInformation = parseInt(localStorage.getItem('userId'));
    //////console.log("update data",this.setToUpdate)
  }


  // for updating question set
  updateQuestionSet(data, isValid, form) {
    ////console.log("is update set from vaild : ", isValid);
    if (!isValid) return;
    data.subjectInformation = parseInt(data.subjectInformation);
    data.classInformation = parseInt(data.classInformation);
    data.boardInformation = parseInt(data.boardInformation);
    data.ccInformation = parseInt(localStorage.getItem('userId'));

    this.dal.updateQuestionPaperSet(data).subscribe(x => {
      if (x.status == "success") {
        Swal.fire({
          icon: 'success',
          title: "Success!",
          text: x.message,
          timer: 3000
        })
        this.getAllSetList();
      } else {
        Swal.fire({
          icon: 'error',
          title: "Error!",
          text: x.message,
          timer: 3000
        })
      }
    })

    ////console.log("update data", data);

  }


  cbsData: any;
  selectedClassId: any;
  selectedBoardId: any;
  subjectListForAddCourse: any;

  cbsError = ""
  // for getting CBS Data
  getCBS() {

    this.dal.getCBS(parseInt(localStorage.getItem('userId'))).subscribe(x => {
      if (x.status == "success") {
        this.cbsError = ""
        this.cbsData = x;
        ////console.log("cbs response", x);
        this.classList = x.cbsInfo.map(x => {
          return {
            classId: x.classId,
            className: x.className,
          }
        });

        this.classList = this.dal.removeDuplicates(this.classList, "className");
        ////////console.log("this.classlist from cbs", this.classlist)
      }
      if (x.status == "error") {
        this.cbsError = "Your coaching does not have class board and subjects to add question"
      }


    });
  }

  // for getting event based board list
  getBoard(event) {
    this.selectedClassId = parseInt(event.target.value);

    ////////console.log("board event class id",this.selectedClassId)
    var filteredClassList = this.cbsData.cbsInfo.filter(x => x.classId == this.selectedClassId);
    this.boardList = filteredClassList.map(x => {
      return { boardId: x.boardId, boardName: x.boardName }
    })
    //////console.log("board list",this.boardList)
    this.boardList = this.dal.removeDuplicates(this.boardList, "boardName");
    //this.boardList = this.classlist[event.target.selectedIndex - 1].boardInformation;
  }
  // for getting event based subject list
  getSubjectForUpdate(event) {
    this.selectedBoardId = parseInt(event.target.value);
    // //////console.log("subject event board id",this.selectedBoardId)
    var filteredClassList = this.cbsData.cbsInfo.filter(x => {

      if (x.classId == this.selectedClassId && x.boardId == this.selectedBoardId) {
        return x;
      }

    });
    // //////console.log("filteredClassList",filteredClassList)
    this.subjectListForAddCourse = filteredClassList.map(x => {

      if (x.boardId === this.selectedBoardId) {

        return {
          subjectId: x.subjectId,
          subjectName: x.subjectName
        }
      }
    })
    this.subjectListForAddCourse = this.dal.removeDuplicates(this.subjectListForAddCourse, "subjectName");
    ////////console.log("this.subjectListForAddCourse",this.subjectListForAddCourse)
    //this.subjectListForAddCourse = this.boardList[event.target.selectedIndex - 1].subjectInformation;
  }


}
