import { Component, OnInit } from '@angular/core';
import { DalService } from 'src/app/services/dal.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-question-set-details',
  templateUrl: './question-set-details.component.html',
  styleUrls: ['./question-set-details.component.css']
})
export class QuestionSetDetailsComponent implements OnInit {

  constructor(public dal: DalService, private route: ActivatedRoute) { }

  ngOnInit() {
    // for getting set id by route params
    this.route.params.subscribe(x => {
      this.setId = x.id;
      this.dal.getAllSetQuestionsWithSetId(x.id).subscribe(y => {
        this.setData = y.questions;
        this.setMetaData = y.questionPaperSetInfo;
        ////console.log("set data", y);
      })
    })
  }

  setMetaData: any;
  setData: any;
  setId: any;

  // for getting set data
  getSetData() {
    this.dal.getAllSetQuestionsWithSetId(this.setId).subscribe(y => {
      this.setData = y.questions;
      ////console.log("set data", y);
    })
  }

  // for removing questions
  removeQuestions(data) {

    let payload = {
      "testQuestionSetIds": [{ "testQuestionSetId": data.testQuestionSetId }]
    }

    ////console.log("question id for remove", payload)
    Swal.fire({
      title: 'Are you sure want to delete question?',
      text: 'You will not be able to recover this question!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) {
        this.dal.removeQuestionsFromSet(payload).subscribe(x => {
          if (x.status == "success") {
            ////console.log("question removed success", x);
            this.getSetData();
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
    })
  }



}
