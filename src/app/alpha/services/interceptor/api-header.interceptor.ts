import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/observable';
@Injectable()
export class ApiHeaderInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    //console.log("interceptor", token);

    if (token) {
      const cloned = req.clone({
        headers: req.headers
          .set("Authorization","Bearer " + token)
          .set('Content-Type', 'application/json; charset=UTF-8')
      });
      return next.handle(cloned);
    }
    else {
      return next.handle(req);
    }
  }
}
