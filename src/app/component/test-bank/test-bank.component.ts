import { Component, OnInit } from '@angular/core';
import { DalService } from 'src/app/services/dal.service';
import { setUpdate } from 'src/app/models/setUpdate.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-test-bank',
  templateUrl: './test-bank.component.html',
  styleUrls: ['./test-bank.component.css']
})
export class TestBankComponent implements OnInit {
  public setToUpdate: setUpdate;
  constructor(public dal: DalService) {
    this.setToUpdate = new setUpdate();
  }
  allTests: any;
  ngOnInit() {
    this.getAllTests();
    // this.getCcMetaData();
  }

  subjectList: any;
  boardList: any;
  classList: any;
  questionType = ["tof", "mcq", "single select"];

  //get cc meta data
  getCcMetaData() {
    this.dal.getCCMetaData(parseInt(localStorage.getItem('userId'))).subscribe(x => {
      ////console.log("cc meta data", x);
      this.classList = x.classInfo;
      this.boardList = x.boardInfo;
      this.subjectList = x.subjectInfo;
      this.questionType = x.distictQuestionType;
    })
  }

  // get all tests
  getAllTests() {
    this.dal.getAllTests(parseInt(localStorage.getItem('userId'))).subscribe(x => {
      this.allTests = x.questionSets;
      ////console.log("all tests", x.questionSets)
    })
  }

  // get data by id on click
  updateDataById(data) {
    //////console.log("data by id", data)
    this.setToUpdate.questionPaperSetId = data.questionPaperSetId
    this.setToUpdate.setName = data.setName
    this.setToUpdate.paperTime = data.paperTime
    this.setToUpdate.totalMark = data.totalMark
    this.setToUpdate.subjectInformation = parseInt(data.subjectInfo.subjectId);
    this.setToUpdate.classInformation = parseInt(data.classInfo.classId);
    this.setToUpdate.boardInformation = parseInt(data.boardInfo.boardId);
    this.setToUpdate.ccInformation = parseInt(localStorage.getItem('userId'));
    ////console.log("update data", this.setToUpdate)
  }

  // for qupdate question set meta data
  updateQuestionSet(data, isValid, form) {
    ////console.log("is update set from vaild : ", isValid);
    if (!isValid) return;
    data.subjectInformation = parseInt(data.subjectInformation);
    data.classInformation = parseInt(data.classInformation);
    data.boardInformation = parseInt(data.boardInformation);
    data.ccInformation = parseInt(localStorage.getItem('userId'));

    this.dal.updateQuestionPaperSet(data).subscribe(x => {
      if (x.status == "success") {
        this.getAllTests();
        Swal.fire({
          icon: 'success',
          title: "Success!",
          text: x.message,
          timer: 3000
        })
        // this.getAllSetList();
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

  // delete question set by set id
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
          this.getAllTests();
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


}
