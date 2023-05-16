import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private jwtHelper: JwtHelperService, private router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = JSON.parse(localStorage.getItem('token')!);
    if (token !== null) {
      if (this.jwtHelper.isTokenExpired(token.token)) {
        localStorage.removeItem('token');
        //Snack Bar
        this.router.navigateByUrl("/signin");
        document.dispatchEvent(new Event('logged-out'));
      }
      else {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token.token}`
          }
        });
      }
    } else {
      if (this.router.url !== "/signin") {
        this.router.navigateByUrl("/signin");
      }
      else {
        console.log("No token found");
      }
    }
    return next.handle(req);
  }
}
