import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import * as CryptoJS from 'crypto-js';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class AuthService {

  private _isUserLoggedIn = new BehaviorSubject<boolean>(false);

  constructor(
    public router: Router,
    private http: HttpClient,
    private jwtHelper: JwtHelperService
  ) {
    this._isUserLoggedIn = new BehaviorSubject<boolean>(false);
  }

  public get(): Observable<any> {
    return this.http.get<any>(environment.authServiceUrl + '/user/enable');
  }

  public signIn(email: string, password: string): Observable<any> {
    return this.http.post(environment.authServiceUrl + '/user/login', {
      email: this.hash(email),
      password: this.hash(password)
    });
  }

  public signUp(email: string, password: string): Observable<any> {
    return this.http.post(environment.authServiceUrl + '/user/register', {
      email: this.hash(email),
      password: this.hash(password)
    });
  }

  public get isUserLoggedIn(): Observable<boolean> {
    return this._isUserLoggedIn.asObservable();
  }

  public setIsUserLoggedIn(value: boolean): void {
    this._isUserLoggedIn.next(value);
  }

  public get isLoggedIn(): boolean {
    const token = JSON.parse(localStorage.getItem('token')!);
    if (token !== null) {
      this.setIsUserLoggedIn(true);
    }
    else {
      this.setIsUserLoggedIn(false);
    }
    return this._isUserLoggedIn.value;
  }

  private hash(text: string): string {
    return CryptoJS.SHA256(text).toString()
  }

  public isAdmin(): boolean {
    const token = JSON.parse(localStorage.getItem('token')!);
    if (token !== null) {
      const decodedToken = this.jwtHelper.decodeToken(token.token);
      if (decodedToken.groups.includes('admin')) {
        return true;
      }
    }
    return false;
  }
}
