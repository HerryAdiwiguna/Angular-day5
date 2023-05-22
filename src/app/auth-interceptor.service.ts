import { HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/internal/operators/tap';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor() { }
  intercept(req: HttpRequest<any>, fwd: HttpHandler){
    console.log(req);
    const clonedReq = req.clone(
      {headers: req.headers.append('Basic','abcdefghij-1234567890')}
    );
    return fwd.handle(clonedReq).pipe(
      tap(
        event => {
          if(event.type === HttpEventType.Response){
            console.log(event.body);
          }
        }
      )
    )
  }
}
