import { Component, OnInit } from '@angular/core';
import { DalService } from 'src/app/services/dal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(public dal: DalService, private router: Router) {

  }
  role: any;
  ngOnInit() {
    this.role = localStorage.getItem('role');

  }

  //for open mobile nav
  openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  }

  // for close mobile nav
  closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }

  // logout call for clearing values in localstorage
  logout() {

    this.dal.userData.access_token = "",
      this.dal.userData.isloggedin = "",
      this.dal.userData.role = ""
    this.dal.userData.userId = ""
    this.dal.userData.userName = ""
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("isloggedin");
    localStorage.removeItem("username");
    localStorage.removeItem("access_token");
    this.router.navigateByUrl("/");
  }


}
