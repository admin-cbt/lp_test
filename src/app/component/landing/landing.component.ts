import { Component, OnInit } from '@angular/core';
import { DalService } from 'src/app/services/dal.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  constructor(public dal: DalService, private router: Router) { }
  user = {
    userName: null,
    userPass: "",
    role: undefined,
  }

  ngOnInit() {
  }

  // for setting values to dal service after login
  setUserData(myUserRole, myUserId, myUserName, myAccessToken) {
    localStorage.setItem("userId", myUserId);
    localStorage.setItem("username", myUserName);
    localStorage.setItem("role", myUserRole);
    localStorage.setItem("access_token", myAccessToken);
    localStorage.setItem("isloggedin", "true");
    this.dal.userData.userName = myUserName
    this.dal.userData.isloggedin = "true";
    this.dal.userData.role = myUserRole;
    this.dal.userData.access_token = myAccessToken;
    this.dal.userData.userId = myUserId;
  }


  // login call
  login(data, isValid, form) {
    ////console.log("is login form valid : ", isValid);
    if (!isValid) return;
    this.dal.login(data).subscribe(x => {

      if (x.body.status == "success") {
        // Swal.fire({
        //   icon: 'success',
        //   title: 'Success!',
        //   text: 'User Logged in successfully!',
        //   timer: 3000
        // })

        let myAccessToken = x.headers.get("authorization").split(" ");
        ////console.log("login", x);
        this.setUserData(x.body.userRole, x.body.userId, x.body.userName, myAccessToken[1]);
        this.router.navigateByUrl('home');
      }
      else if (x.body.status == "error") {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: x.message,
          timer: 3000
        })
      }



    })
    ////console.log("login data", data);
  }


}
