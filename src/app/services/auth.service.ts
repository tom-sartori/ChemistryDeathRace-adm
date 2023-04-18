import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import * as CryptoJS from 'crypto-js';

@Injectable()
export class AuthService {

  private _loading$ = new BehaviorSubject<boolean>(false);
  get loading$(): Observable<boolean> {
    return this._loading$.asObservable();
  }

  private setLoadingStatus(loading: boolean) {
    this._loading$.next(loading);
  }

  private _isUserLoggedIn$ = new BehaviorSubject<boolean>(false);
  get isUserLoggedIn$(): Observable<boolean> {
    return this._isUserLoggedIn$.asObservable();
  }
  private setIsUserLoggedIn$(value: boolean) {
    this._isUserLoggedIn$.next(value);
  }

  constructor(
    public router: Router,
    private http: HttpClient
  ) { }

  signIn(email: string, password: string) {
    this.setLoadingStatus(true);
    this.http.post(environment.authServiceUrl + '/user/login', {email: email, password: this.hash(password)}).subscribe(
      (response: any) => {
        localStorage.setItem('token', JSON.stringify(response));
        this.setIsUserLoggedIn$(true);
        this.router.navigateByUrl("/questions");
        this.setLoadingStatus(false);
      }
    )
  }

  signUp(email: string, password: string) {
    this.setLoadingStatus(true);
    this.http.post(environment.authServiceUrl + '/user/register', {email: email, password: this.hash(password)}).subscribe(
      (response: any) => {
        this.router.navigateByUrl("/signin");
        this.setLoadingStatus(false);
      }
    )
  }

  get isLoggedIn(): boolean {
    const token = JSON.parse(localStorage.getItem('token')!);
    if (token !== null){
      this.setIsUserLoggedIn$(true);
    } else {
      this.setIsUserLoggedIn$(false);
    }
    return this._isUserLoggedIn$.value;
  }

  signOut() {
    localStorage.removeItem('token');
    this.router.navigateByUrl("/signin");
    this.setIsUserLoggedIn$(false);
  }

  public get() : Observable<any> {
    this.setLoadingStatus(true);
    return this.http.get<any>(environment.authServiceUrl + '/user/enable');
  }

  private hash(text: string): string {
    return CryptoJS.SHA256(text).toString()
  }
}
