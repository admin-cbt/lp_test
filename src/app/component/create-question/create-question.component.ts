import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { DalService } from 'src/app/services/dal.service';
import Swal from 'sweetalert2';
//import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Question } from '../../models/question.model'

@Component({
  selector: 'app-create-question',
  templateUrl: './create-question.component.html',
  styleUrls: ['./create-question.component.css']
})
export class CreateQuestionComponent implements OnInit {
  uploadForm: FormGroup;
  isQuestionLoading = false;
  question: Question;
  constructor(private formBuilder: FormBuilder, public dal: DalService) {
    this.question = new Question();
  }


addMoreImages: boolean = false;

  classList: any;
  boardList: any;
  subjectList: any;
  topicList = [
    {
      topicId: 1,
      topicName: 'topic 1'
    },
    {
      topicId: 1,
      topicName: 'topic 2'
    }
  ];

  questionType = ['tof', 'mcq', 'single select'];
  difficultyLevel = ['easy', 'medium', 'hard'];
  ngOnInit() {
    this.uploadForm = this.formBuilder.group({
      images: ['']
    });
    this.getCBS();
    
  }
  options = [
    {
      id: Math.floor(Math.random() * 1000),
      optionName: '',
      isCorrectAnswer: false
    },
    {
      id: Math.floor(Math.random() * 1000),
      optionName: '',
      isCorrectAnswer: false
    }
  ];



  imagesForDisplay: any;

  // for adding row to options
  addRow() {
    let opt = { id: Math.floor(Math.random() * 1000), optionName: '', isCorrectAnswer: false }
    this.options.push(opt);
  }



  // for remove row from options
  removeRow(i) {
    //console.log('delete options', i, this.options)
    this.options = this.options.filter(x => x.id != i);
    //this.options = this.options.splice(i, 1);
  }




  uploadFilePath: any;
  selectedfile = [];
  images: any[];

  // get file data and upload file
  selectImage(event) {
    for(var i=0; i< event.target.files.length;i++){
    this.selectedfile.push(event.target.files[i]);
    }
  }
  


  imageName=[];
  // add questions
  addQuestion(question, isValid, form) {
    this.isQuestionLoading = true;
   
    if (this.selectedfile) {
     
      this.dal.uploadImages(this.selectedfile).subscribe((res) => {
        if (res.status == 'success') {
          this.imagesForDisplay = res.imagesInformation;
          let imageIds = res.imagesInformation.map(x => {
            return { 'imageId': x.imageId }
          })

          this.question.imagesIds = imageIds;
          if (!isValid) {
            this.isQuestionLoading = false;
            return;
          }
      
          //removing ids from options object
          this.question.options = this.options.map(x => {
            return { 'optionName': x.optionName, 'isCorrectAnswer': x.isCorrectAnswer }
          })
      
          if (question.options.length >= 1) {
            this.question.isOptionAvailable = true;
          }
          this.question.ccInformation = parseInt(localStorage.getItem('userId'));
          this.question.classInformation = parseInt(question.classInformation);
          this.question.boardInformation = parseInt(question.boardInformation);
          this.question.subjectInformation = parseInt(question.subjectInformation);
          this.question.isImageAvailable = true;
          this.question.imageUrl = null;

          // if (!this.question.imagesIds) {
          //   this.question.imagesIds = []
          // }
          this.dal.addQuestion(this.question).subscribe(x => {
            if (x.status == 'success') {
              this.isQuestionLoading = false;
              form.resetForm();
              this.imagesForDisplay = null;
              Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Question added with image successfully!',
                timer: 2000
              })
            } else {
              this.isQuestionLoading = false;
              Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: x.message,
                timer: 2000
              })
            }
      
          });

        }
      });
         

    }
    else {
      if (!isValid) {
        this.isQuestionLoading = false;
        return;
      }
  
      //removing ids from options object
      this.question.options = this.options.map(x => {
        return { 'optionName': x.optionName, 'isCorrectAnswer': x.isCorrectAnswer }
      })
  
      if (question.options.length >= 1) {
        this.question.isOptionAvailable = true;
      }
      this.question.ccInformation = parseInt(localStorage.getItem('userId'));
      this.question.classInformation = parseInt(question.classInformation);
      this.question.boardInformation = parseInt(question.boardInformation);
      this.question.subjectInformation = parseInt(question.subjectInformation);
      this.question.isImageAvailable = false;
      if (!this.question.imagesIds) {
        this.question.imagesIds = []
      }
      this.dal.addQuestion(this.question).subscribe(x => {
        if (x.status == 'success') {
          this.isQuestionLoading = false;
          form.resetForm();
          this.imagesForDisplay = null;
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Question added successfully!',
            timer: 2000
          })
        } else {
          this.isQuestionLoading = false;
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: x.message,
            timer: 2000
          })
        }
  
      });
    } 
  }

  selectedClassId: number;
  selectedBoardId: number;
  selectedSubjectId: number;
  cbsData: any;

  cbsError = '';
  // for getting CBS data
  getCBS() {

    this.dal.getCBS(parseInt(localStorage.getItem('userId'))).subscribe(x => {
      if (x.status == 'success') {
        this.cbsError == ''
        this.cbsData = x;
        ////console.log('cbs response', x);
        this.classList = x.cbsInfo.map(x => {
          return {
            classId: x.classId,
            className: x.className,
          }
        });

        this.classList = this.dal.removeDuplicates(this.classList, 'className');
        ////////console.log('this.classlist from cbs', this.classlist)
      }
      if (x.status == 'error') {
        this.cbsError = 'Your coaching does not have class board and subjects to add question'
      }

    });
  }

  subjectListForAddCourse: any;
  // for getting event based board list for cbs
  getBoard(event) {
    this.selectedClassId = parseInt(event.target.value);

    ////////console.log('board event class id',this.selectedClassId)
    var filteredClassList = this.cbsData.cbsInfo.filter(x => x.classId == this.selectedClassId);
    this.boardList = filteredClassList.map(x => {
      return { boardId: x.boardId, boardName: x.boardName }
    })
    //////console.log('board list',this.boardList)
    this.boardList = this.dal.removeDuplicates(this.boardList, 'boardName');
    //this.boardList = this.classlist[event.target.selectedIndex - 1].boardInformation;
  }
  // for getting event based subject list for cbs
  getSubjectForUpdate(event) {
    this.selectedBoardId = parseInt(event.target.value);
    // //////console.log('subject event board id',this.selectedBoardId)
    var filteredClassList = this.cbsData.cbsInfo.filter(x => {

      if (x.classId == this.selectedClassId && x.boardId == this.selectedBoardId) {
        return x;
      }

    });
    // //////console.log('filteredClassList',filteredClassList)
    this.subjectListForAddCourse = filteredClassList.map(x => {

      if (x.boardId === this.selectedBoardId) {

        return {
          subjectId: x.subjectId,
          subjectName: x.subjectName
        }
      }
    })
    this.subjectListForAddCourse = this.dal.removeDuplicates(this.subjectListForAddCourse, 'subjectName');
    ////////console.log('this.subjectListForAddCourse',this.subjectListForAddCourse)
    //this.subjectListForAddCourse = this.boardList[event.target.selectedIndex - 1].subjectInformation;
  }

  // for toggling single select option
  toggleOptions(item) {
    this.options.map(x => {
      x.optionName === item.optionName ? x.isCorrectAnswer = true : x.isCorrectAnswer = false
      return x;
    })
  }



  // for deleting image from question
  deleteImageFromQuestion(imageName) {   
    this.selectedfile = [...this.selectedfile].filter(x => x.name != imageName)
    // this.dal.deleteImageById(imageId).subscribe(x => {
    //   if (x.status == 'success') {
    //     Swal.fire({
    //       icon: 'success',
    //       title: 'Success!',
    //       text: x.message,
    //       timer: 3000
    //     })

    //     ////console.log('image delete success res', x, this.imagesForDisplay)
    //     this.imagesForDisplay = this.imagesForDisplay.filter(x => x.imageId != imageId);
    //   }
    //   if (x.status == 'error') {
    //     Swal.fire({
    //       icon: 'error',
    //       title: 'Error!',
    //       text: x.message,
    //       timer: 3000
    //     })
    //     ////console.log('image delete failed', x)
    //   }

    // })
  }

}
