import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = JSON.parse(localStorage.getItem('token')!);
    if (token !== null) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token.token}`
        }
      });
    } else {
      console.log("No token found");
    }
    return next.handle(req);
  }

}
