import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { catchError, map } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  endPointUrl: string = 'https://angular-training-app-42109-default-rtdb.asia-southeast1.firebasedatabase.app/';
  postUrl: string = this.endPointUrl+'post.json';
  data: any;

  errorHandling = new Subject<any>();

  constructor(private http: HttpClient) { }

  //for posting data
  createAndPost(postData: Post){
    // Send Http request
    console.log(postData);
    this.http.post<{name: string}>(this.postUrl, postData).subscribe(
      (data) => {
        console.log(data);
        this.errorHandling.next(null);
      }, 
      error => {
        this.errorHandling.next(error);
      }
    )
  }

  //for fetching data
  fetchPost(){
    let customParam = new HttpParams();
    customParam = customParam.append('print','pretty');
    customParam = customParam.append('custom-param','custom-param-value');

    return this.http.get<{[key: string]: Post}>(this.postUrl,{
      headers: new HttpHeaders({
        'custom-header' : 'hello from customer header'
      }),
      params: customParam,
    })
    .pipe(
      map(responseData => {
        const postArray: Post[] = [];
        for(const key in responseData){
          if(responseData.hasOwnProperty(key)){
            postArray.push({...responseData[key],id: key})
          }
        }
        return postArray;
      }),
      catchError(
        errorRes => {
          return throwError(errorRes);
        }
      )
    );
  }

  // for update data
  updataData(data: any){
    return this.http.patch(this.postUrl, data);
  }

  //delete data
  deletePosts(){
    return this.http.delete(this.postUrl);
  }

}
