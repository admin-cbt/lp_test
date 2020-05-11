import { Component, OnInit, Input, Output } from '@angular/core';
import { DalService } from 'src/app/services/dal.service';
import { EventEmitter } from '@angular/core';
import { UpdatedQuestion } from 'src/app/models/updateQuestion.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {

  @Input() questionList: any;
  @Input() filterData: any;
  @Output() checkedQuestionList: any = new EventEmitter();
  @Output() questionUpdated: any = new EventEmitter();
  @Output() imageUpdated: any = new EventEmitter();
  @Output() imageDeleted: any = new EventEmitter();
  @Output() pageChanged: any = new EventEmitter();
  public questionToUpdate: UpdatedQuestion;
  constructor(public dal: DalService) {
    this.questionToUpdate = new UpdatedQuestion()
  }
  p: number = 1;
  uploadFilePath: any;
  questionSetError: any;
  
  previousPage() {
    if (this.p == 1) {
      this.p = 1;
      this.pageChanged.emit(this.p);
      //console.log("previous page", this.p)
    } else {
      this.p = this.p - 1;
      this.pageChanged.emit(this.p);
      //console.log("previous page", this.p)
    }
  }

  nextPage() {
    this.p = this.p + 1;
    this.pageChanged.emit(this.p);
    //console.log("next page", this.p)
  }

  // pageChanged(event) {
  //   //this.p = event
  //   //console.log("page event", event)
  // }

  ngOnInit() {
    //this.getAllQuestions()
    // this.getCcMetaData();
  }

  questionType = ["tof", "mcq", "single select"];
  difficultyLevel = ["easy", "medium", "hard"];
  classList: any;
  boardList: any;
  subjectList: any;
  //topic list
  topicList = [
    {
      topicId: 1,
      topicName: "topic 1"
    },
    {
      topicId: 1,
      topicName: "topic 2"
    }
  ];


  // for getting cc meta data
  getCcMetaData() {
    this.dal.getCCMetaData(parseInt(localStorage.getItem('userId'))).subscribe(x => {
      ////console.log("cc meta data", x);
      this.classList = x.classInfo;
      this.boardList = x.boardInfo;
      this.subjectList = x.subjectInfo;

    })
  }



  isDisabled: boolean = true;
  //toggle edit disable
  edit() {
    this.isDisabled = !this.isDisabled;
  }

  queIds: any;
  classForFilter: undefined;
  subjectForFilter: undefined;
  diffLevelForFilter: undefined;
  queTypeForFilter: undefined;
  marksForFilter: undefined

  // for getting checked question ids
  getSelectedQuestionIds() {
    this.queIds = this.questionList.filter(x => x.isChecked == true);
    //////console.log("checked questions",this.queIds);
    this.checkedQuestionList.emit(this.queIds);
  }

  questionDetailsById: any;
  //getting question details by id
  getQuestionDetails(data) {
    //console.log("que details by id", data);
    this.questionDetailsById = data;
  }
  filteredData: any

  // filter function for questions
  filterQuestions(classForFilter, subjectForFilter, diffLevelForFilter, queTypeForFilter, marksForFilter) {

    if (classForFilter != undefined) {
      this.filteredData = this.questionList.filter(x => x.classInfo.classId == classForFilter);
      ////console.log("filter by class", this.filteredData);
    }
    if (subjectForFilter != undefined) {
      if (this.filteredData) {
        this.filteredData = this.filteredData.filter(x => x.subjectInfo.subjectId == subjectForFilter);
        ////console.log("filter by subject1", this.filteredData);
      } else {
        this.filteredData = this.questionList.filter(x => x.subjectInfo.subjectId == subjectForFilter);
        ////console.log("filter by subject2", this.filteredData);
      }
    }
    if (diffLevelForFilter != undefined) {
      if (this.filteredData) {
        this.filteredData = this.filteredData.filter(x => x.difficultyLevel == diffLevelForFilter);
        ////console.log("filter by diff level1", this.filteredData);
      } else {
        this.filteredData = this.questionList.filter(x => x.difficultyLevel == diffLevelForFilter);
        ////console.log("filter by diff level2", this.filteredData);
      }
    }
    if (queTypeForFilter != undefined) {
      if (this.filteredData) {
        this.filteredData = this.filteredData.filter(x => x.questionType == queTypeForFilter);
        ////console.log("filter by que type1", this.filteredData);
      } else {
        this.filteredData = this.questionList.filter(x => x.questionType == queTypeForFilter);
        ////console.log("filter by que type2", this.filteredData);
      }
    }
    if (marksForFilter != undefined) {
      if (this.filteredData) {
        this.filteredData = this.filteredData.filter(x => x.maximumMarks == marksForFilter);
        ////console.log("filter by marks1", this.filteredData);
      } else {
        this.filteredData = this.questionList.filter(x => x.maximumMarks == marksForFilter);
        ////console.log("filter by marks2", this.filteredData);
      }
    }
  }

  // for clearing filter data
  clearFilter() {
    this.filteredData = null;

  }

  // for updating question
  updateQuestion(data, isValid, form) {
    ////console.log("isForm valid : ", isValid);
    if (!isValid) return;
    this.questionToUpdate.questionId = data.questionId;
    this.questionToUpdate.question = data.question;
    this.questionToUpdate.topicName = data.topicName;
    this.questionToUpdate.isImageAvailable = data.isImageAvailable;
    this.questionToUpdate.imageUrl = data.imageUrl || "";
    this.questionToUpdate.questionType = data.questionType;
    this.questionToUpdate.difficultyLevel = data.difficultyLevel;
    this.questionToUpdate.maximumMarks = data.maximumMarks;
    this.questionToUpdate.timeToSolve = data.timeToSolve;
    this.questionToUpdate.isOptionAvailable = data.isOptionAvailable;
    this.questionToUpdate.subjectInformation = parseInt(data.subjectInfo.subjectId);
    this.questionToUpdate.classInformation = parseInt(data.classInfo.classId);
    this.questionToUpdate.boardInformation = parseInt(data.boardInfo.boardId);
    this.questionToUpdate.options = data.options;
    this.questionToUpdate.ccInformation = parseInt(localStorage.getItem('userId'));
    //////console.log("updated question", this.questionToUpdate);

    this.dal.updateQuestion(this.questionToUpdate).subscribe(x => {

      if (x.status == "success") {
        //form.resetForm();
        this.isDisabled = true;
        ////console.log("question updated success", x);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: x.message,
          timer: 3000
        })
        this.questionUpdated.emit(true);
      }
    })

  }

  // delete image with image id
  deleteImageFromQuestion(imageId) {
    ////console.log("image id to delete", imageId)
    this.dal.deleteImageById(imageId).subscribe(x => {
      if (x.status == "success") {
        Swal.fire({
          icon: 'success',
          title: "Success!",
          text: x.message,
          timer: 3000
        })
        this.imageDeleted.emit(true);
        ////console.log("image delete success res", x)
        this.questionDetailsById.images = this.questionDetailsById.images.filter(x => x.imageId != imageId);
      }
      if (x.status == "error") {
        Swal.fire({
          icon: 'error',
          title: "Error!",
          text: x.message,
          timer: 3000
        })
        ////console.log("image delete failed", x)
      }

    })
  }

  selectedfile: any;
  //get upload data and upload images for question using question id
  getUploadData(event, questionId) {
    this.selectedfile = event.target.files;
    ////console.log("files selected>>>>>>>>>>>>>", this.selectedfile)
    if (this.selectedfile) {
      ////console.log("selected file and question id", this.selectedfile, questionId)
      this.dal.uploadImagesByQuestionId(this.selectedfile, questionId).subscribe((res) => {
        if (res.status == "success") {
          this.imageUpdated.emit(true)
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: `${res.message}`,
            timer: 2000
          })

        }
        if (res.status == "error") {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: `${res.message}`,
            timer: 2000
          })
        }
      });
    }
    else {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: "No Image selected",
        timer: 2000
      })
    }

  }


}
