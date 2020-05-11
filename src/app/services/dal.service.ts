import { Injectable } from '@angular/core';
import { CustomHttpService } from './custom-http.service';
import { environment } from '../../environments/environment'
import { HttpHeaders } from '@angular/common/http';
import { login } from '../models/login.model'

@Injectable({
  providedIn: 'root'
})
export class DalService {
  authHeaders: any;
  public loginPayload: login;
  constructor(private customHttp: CustomHttpService) {
    this.getAllClasses().subscribe(x => {
      this.classList = x;
      //console.log("allclasses in dal", x)
    })
    this.getAllBoards().subscribe(x => {
      this.boardList = x;
    })
    this.getallSubjects().subscribe(x => {
      this.subjectList = x;
    })
    this.setheaders();
    this.loginPayload = new login();
    this.userData.userName = localStorage.getItem("username");
    this.userData.isloggedin = localStorage.getItem("isloggedin");
    let role = localStorage.getItem("role");
    if (role != null) {
      this.userData.role = localStorage.getItem("role").toLowerCase();
    }

    this.userData.access_token = localStorage.getItem("access_token");
    this.userData.userId = localStorage.getItem("userId");
    // //console.log("userdata in dal const", this.userData);
  }

  userData = {
    userName: "",
    isloggedin: "",
    role: "",
    access_token: "",
    userId: ""
  }

  classList: any;
  boardList: any;
  subjectList: any;


  // for setting headers
  setheaders() {
    this.authHeaders =
      new HttpHeaders({
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem('access_token'),

      });
  }

  uploadImages(payload) {
    return this.customHttp.uploadImage(environment.url, payload)
  }

  uploadImagesByQuestionId(payload, questionId) {
    return this.customHttp.uploadImageByQuestionId(environment.url, payload, questionId)
  }

  deleteImageById(id) {
    return this.customHttp.deleteById(`${environment.url}/test/question/image/${id}`)
  }


  // login endpoint
  login(data) {
    this.loginPayload.appName = navigator.appName;
    this.loginPayload.username = data.userName,
      this.loginPayload.role = data.role,
      this.loginPayload.password = data.userPass,
      this.loginPayload.appName = navigator.appName,
      this.loginPayload.appVersion = navigator.appVersion,
      this.loginPayload.userPlatform = navigator.platform,
      this.loginPayload.language = navigator.language,
      this.loginPayload.userLat = 1,
      this.loginPayload.userLong = 2,
      this.loginPayload.userIpAddress = 10
    ////console.log("login payload",this.loginPayload);

    return this.customHttp.postForLogin(`${environment.url}/login`, this.loginPayload);
  }

  // get CBS endpoint
  getCBS(ccId) {
    return this.customHttp.get(`${environment.url}/cbs/${ccId}`);
  }

  // get all questions endpoint
  getAllQuestions(ccId) {
    // return this.customHttp.get("https://jsonblob.com/api/jsonBlob/1cadca1c-7974-11ea-94ef-757fcd002724");
    return this.customHttp.get(`${environment.url}/test/questions/${ccId}`);
  }

  getAllQuestionsWithQuery(ccId, pageNo, pageSize) {
    // return this.customHttp.get("https://jsonblob.com/api/jsonBlob/1cadca1c-7974-11ea-94ef-757fcd002724");
    return this.customHttp.get(`${environment.url}/test/questions/${ccId}?pageNo=${pageNo}&pageSize=${pageSize}`);
  }


  // get all tests endpoint
  getAllTests(ccId) {
    return this.customHttp.get(`${environment.url}/test/set/${ccId}`);
  }


  // add question endpoint
  addQuestion(payload) {
    //return this.customHttp.put("https://jsonblob.com/api/jsonBlob/0ea53492-6523-11ea-b5e4-dbfd6dfa8e4d",payload)
    return this.customHttp.post(`${environment.url}/test/question`, payload);
  }

  // update question endpoint
  updateQuestion(payload) {
    return this.customHttp.put(`${environment.url}/test/question`, payload)
  }

  // for getting global data for class. board, subject
  getAllClasses() {
    return this.customHttp.get(`${environment.url}/master/class`);
  }

  getAllBoards() {
    return this.customHttp.get(`${environment.url}/board`);
  }

  getallSubjects() {
    return this.customHttp.get(`${environment.url}/master/subject`);

  }

  // for getting cc meta data

  getCCMetaData(ccId) {
    return this.customHttp.get(`${environment.url}/test/${ccId}`);
  }

  // adding question paper set
  saveQuestionPaperSet(payload) {
    return this.customHttp.post(`${environment.url}/test/set`, payload);
  }

  //get all set list
  getAllSetList(ccId) {
    return this.customHttp.get(`${environment.url}/test/set/${ccId}`);
  }


  saveQuestionPaperSetWithQuestions(payload) {
    return this.customHttp.post(`${environment.url}/test/question/set`, payload);
  }

  getAllSetQuestionsWithSetId(setId) {
    return this.customHttp.get(`${environment.url}/test/question/set/${setId}`);
  }

  removeQuestionsFromSet(payload) {
    return this.customHttp.delete(`${environment.url}/test/question/set`, payload);
  }

  removeQuestionPaperSet(setId) {
    return this.customHttp.delete(`${environment.url}/test/set/${setId}`);
  }


  updateQuestionPaperSet(payload) {
    return this.customHttp.put(`${environment.url}/test/set`, payload);
  }

  assignSetToStudent(payload) {
    return this.customHttp.post(`${environment.url}/test/students`, payload);
  }

  getallQuestionsByStudentId(studentId) {
    return this.customHttp.get(`${environment.url}/test/student/${studentId}`);
  }

  uploadMultipleImages(payload, questionId) {

    const formData = new FormData();
    // for (let file of payload) {
    //   formData.append('images', file);
    // }
    formData.append('images', payload);

    return this.customHttp.postForImageUpload(`${environment.url}/test/question/images/${questionId}`, formData);
  }

  getAllSetListByCcId(ccId) {
    return this.customHttp.get(`${environment.url}/test/set/${ccId}`);
  }

  getAllStudentsByCcId(ccId) {
    return this.customHttp.get(`${environment.url}/cc/student/${ccId}`);
  }

  getAssignedStudentsByCcId(ccId) {
    return this.customHttp.get(`${environment.url}/test/cc/student/${ccId}`);
  }

  removeDuplicates(array, key) {
    return array.reduce((accumulator, element) => {
      if (!accumulator.find(el => el[key] === element[key])) {
        accumulator.push(element);
      }
      return accumulator;
    }, []);
  }





}
