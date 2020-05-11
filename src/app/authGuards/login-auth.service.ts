import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DalService } from '../services/dal.service';


@Injectable({
  providedIn: 'root'
})
export class LoginAuthService implements CanActivate {

  constructor(public router: Router,public dal : DalService) { }
  canActivate(
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.dal.userData.isloggedin != "true") {
      this.router.navigateByUrl("/");
      return false;
    }
    else {
      return true;
    }
  }
}
