import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CustomHttpService {
  authHeaders: any;
  loginHeaders: any;
  imageHeaders: any;
  constructor(private http: HttpClient) {
    this.setheaders();
  }

  setheaders() {
    this.authHeaders =
      new HttpHeaders({
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem('access_token'),

      });

    this.loginHeaders =
      new HttpHeaders({
        'Content-Type': 'text/plain'
      });

    this.imageHeaders =
      new HttpHeaders({
        'authorization': localStorage.getItem('access_token'),
        //'Content-Type': 'multipart/form-data'
        //'Content-Type': undefined
        'Content-Type': 'multipart/form-data; charset=utf-8; boundary="another cool boundary"'
      });

  }



  get(url): Observable<any> {
    return this.http.get(url, { headers: this.authHeaders });
  }

  put(url, payload): Observable<any> {
    return this.http.put(url, payload, { headers: this.authHeaders });
  }

  postForLogin(url, payload): Observable<any> {
    return this.http.post(url, payload, { headers: this.loginHeaders, observe: 'response' });
  }


  postForImageUpload(url, payload): Observable<any> {
    return this.http.post(url, payload, { headers: this.imageHeaders });
  }


  post(url, payload): Observable<any> {
    return this.http.post(url, payload, { headers: this.authHeaders });
  }



  delete(url, payload?) {
    return this.http.request<any>("DELETE", url, { body: payload, headers: this.authHeaders });
  }


  deleteById(url): Observable<any> {
    return this.http.delete(url, { headers: this.authHeaders });
  }

  uploadImage(url, image): Observable<any> {
    let customhearders = new HttpHeaders({
      'authorization': localStorage.getItem('access_token')
    });

    const formData = new FormData();

    for (var i of image) {
      formData.append("images", i)
    }

    // formData.append('images', image);
    return this.http.post(url + "/test/question/images", formData,
      { headers: customhearders });
  }

  uploadImageByQuestionId(url, image, questionId): Observable<any> {
    let customhearders = new HttpHeaders({
      'authorization': localStorage.getItem('access_token')
    });

    const formData = new FormData();

    for (var i of image) {
      formData.append("images", i)
    }

    // formData.append('images', image);
    return this.http.post(url + `/test/question/images/${questionId}`, formData,
      { headers: customhearders });
  }

}
