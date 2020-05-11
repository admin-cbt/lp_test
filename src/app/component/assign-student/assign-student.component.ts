import { Component, OnInit } from '@angular/core';
import { DalService } from 'src/app/services/dal.service';
import { queSetWithQuestions } from 'src/app/models/queSetWithQuestions.model';
import { studentAssignSet } from 'src/app/models/studentAssignSet.model';
import Swal from 'sweetalert2'; 

@Component({
  selector: 'app-assign-student',
  templateUrl: './assign-student.component.html',
  styleUrls: ['./assign-student.component.css']
})
export class AssignStudentComponent implements OnInit {
  public questionSetWithQuestions: queSetWithQuestions;
  public studentAssignSet: studentAssignSet;
  questionPaperSetId: any;
  isEnrollPending: any;
  enrollErrorMessage: any;


  constructor(public dal: DalService) {
    this.studentAssignSet = new studentAssignSet();
    this.questionSetWithQuestions = new queSetWithQuestions();
  }
  studentList: any;
  assignedStudentList: any;


  ngOnInit() {
    this.getAllSetList();
    this.getAllStudents();
    this.getAssignedStudents();
  }
  allQuestionSets: any;

  // for getting all question set list
  getAllSetList() {
    this.dal.getAllSetList(parseInt(localStorage.getItem('userId'))).subscribe(x => {
      this.allQuestionSets = x.questionSets;
      this.allQuestionSets = this.allQuestionSets.sort(function (a, b) { return a.setName - b.setName });
      //console.log("all set list", this.allQuestionSets)
    })
  }

  // get all student list by ccId
  getAllStudents() {
    this.dal.getAllStudentsByCcId(parseInt(localStorage.getItem('userId'))).subscribe(x => {
      this.studentList = x.studentInformation;
      ////console.log("all students", x)
    })
  }

  // get assigned students for question set
  getAssignedStudents() {
    this.dal.getAssignedStudentsByCcId(parseInt(localStorage.getItem('userId'))).subscribe(x => {
      this.assignedStudentList = x.questionSetInfo;
      ////console.log("assigned students", x)
    })
  }


  assignedStudents: any;
  unassignedStudents: any;
  currentSetStudents: any;
  enrolledStudentIds: any;


  // for sorting assigned and unassigned students
  sortStudents(event) {
    this.currentSetStudents = this.assignedStudentList.filter(x => x.questionPaperSetId == event.target.value);
    //this.assignedStudents = this.assignedStudentList.filter(x => x.questionPaperSetId == event.target.value);
    //this.assignedStudents = this.dal.removeDuplicates(this.assignedStudents.studentInfo, "studentId");
    this.assignedStudents = this.dal.removeDuplicates(this.currentSetStudents[0].studentInfo.map(x => { return x }), "studentId")
    ////console.log("enrolled students for current set", this.assignedStudents);
    this.enrolledStudentIds = this.assignedStudents.map(x => x.studentId);
    //////console.log("enrolled students", enrolledStudentIds);

    this.unassignedStudents = this.studentList.filter(val => !this.enrolledStudentIds.includes(val.studentId));
    //////console.log("unenrolled student", this.unassignedStudents)
  }

  studentIds: any;
  questionSetError: boolean = false;
  studentError: boolean = false;

  //for assign students
  // assignStudents(data) {
  //   this.questionSetError = false;
  //   this.studentError = false;
  //   if (data.questionPaperSetId == undefined) {

  //     this.questionSetError = true;
  //   } else {
  //     this.questionSetError = false;
  //     if (this.studentIds == undefined || !this.studentIds.length) {

  //       this.studentError = true;
  //       this.studentAssignSet.studentIds = [];
  //       this.studentAssignSet.questionPaperSetId = parseInt(data.questionPaperSetId);
  //     } else {
  //       this.studentError = false;


  //       let students = this.studentIds.map(x => {
  //         return { "studentId": parseInt(x) }
  //       })

  //       this.studentAssignSet.questionPaperSetId = parseInt(data.questionPaperSetId);
  //       this.studentAssignSet.studentIds = students;
  //       ////console.log("selected student for save", this.studentAssignSet);

  //       this.dal.assignSetToStudent(this.studentAssignSet).subscribe(x => {
  //         if (x.status == "successs") {
  //           ////console.log("student assign success", x);
  //           Swal.fire({
  //             icon: 'success',
  //             title: "Success!",
  //             text: x.message,
  //             timer: 3000
  //           })
  //         } else {
  //           Swal.fire({
  //             icon: 'error',
  //             title: "Error!",
  //             text: x.message,
  //             timer: 3000
  //           })
  //         }


  //       })
  //     }

  //   }
  // }
  unenrolledInput: string;

  // for searching unassigned students
  searchUnassigned() {
    var valThis = this.unenrolledInput.toLowerCase();
    if (valThis == "") {
      $('#unenrolledUL > li').show();
    } else {
      $('#unenrolledUL > li').each(function () {
        var text = $(this).text().toLowerCase();
        (text.indexOf(valThis) >= 0) ? $(this).show() : $(this).hide();
      });
    };
  }

  enrolledInput: String;
  // for searching assigned students
  searchAssigned() {
    var valThis = this.enrolledInput.toLowerCase();
    if (valThis == "") {
      $('#enrolledUL > li').show();
    } else {
      $('#enrolledUL > li').each(function () {
        var text = $(this).text().toLowerCase();
        (text.indexOf(valThis) >= 0) ? $(this).show() : $(this).hide();
      });
    };
  }

  // assign students function
  assign(setId) {
    var selected = new Array();
    var ul = document.getElementById("unenrolledUL");
    var chks = ul.getElementsByTagName("INPUT");
    // Loop and push the checked CheckBox value in Array.
    for (var i = 0; i < chks.length; i++) {
      if ((chks[i] as HTMLInputElement).checked) {
        selected.push((chks[i] as HTMLInputElement).value);
      }
    }
    //Display the selected CheckBox values.
    if (selected.length > 0) {

      let studentIdList = selected.map(x => {
        return { studentId: parseInt(x) }
      })
      let selected1 = selected.map(x => parseInt(x))
      let newlyEnrolled = this.unassignedStudents.filter(val => selected1.includes(val.studentId));
      newlyEnrolled = newlyEnrolled.map(x => {
        return { studentId: x.studentId, studentName: x.studentName }
      })
      ////console.log("newly enrolled", newlyEnrolled);
      let data = {
        questionPaperSetId: setId,
        studentIds: studentIdList
      }
      ////console.log("assign data", data);

      this.dal.assignSetToStudent(data).subscribe(x => {
        if (x.status == "success") {
          let selected2 = selected.map(x => parseInt(x))
          this.enrolledStudentIds.push(...selected2);
          ////console.log("new enrolled students", this.enrolledStudentIds);
          this.unassignedStudents = this.studentList.filter(val => !this.enrolledStudentIds.includes(val.studentId));
          this.assignedStudents.push(...newlyEnrolled);
          //this.assignedStudents = 
          ////console.log("this.unassignedStudents", this.unassignedStudents);
          ////console.log("student assign success", x);
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


    } else {
      alert("Please select students to assign")
    }
  }




}
