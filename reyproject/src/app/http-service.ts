import { Injectable, Inject } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private url = 'http://localhost:3000/api';  // insert url later
  constructor(private http: HttpClient = Inject(HttpClient)) {}
  
  getData(endpoint:string, body: {[key: string]: any} = {}): Observable<any> {
    let params = new HttpParams();

    for (const key in body) {
      if (body[key] !== undefined && body[key] !== null) {
        params = params.set(key, body[key]);
      }
    }
    console.log("Sending get request");
    return this.http.get(`${this.url}/${endpoint}`, {params});
  }

  postData(endpoint:string, body: {[key:string]:any} = {}): Observable<any> {
    console.log("Sending post request with credentials");
    return this.http.post(`${this.url}/${endpoint}`, body, {
      withCredentials: true
    });
  }

  postDataNoAuth(endpoint:string, body: {[key:string]:any} = {}): Observable<any> {
    console.log("Sending post request");
    return this.http.post(`${this.url}/${endpoint}`, body);
  }
}
