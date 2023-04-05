import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import { Router } from '@angular/router';
import {BehaviorSubject, Observable} from "rxjs";
import {Notify} from "notiflix/build/notiflix-notify-aio";

@Injectable()
export class AuthService {

  userData: any;

  private _isUserLoggedIn$ = new BehaviorSubject<boolean>(false);
  get isUserLoggedIn$(): Observable<boolean> {
    return this._isUserLoggedIn$.asObservable();
  }
  private setIsUserLoggedIn$(value: boolean) {
    this._isUserLoggedIn$.next(value);
  }

  constructor(public afAuth: AngularFireAuth,
              public router: Router,
  ) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  signIn(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password).then((result) => {
      console.log(result);
      this.setIsUserLoggedIn$(true);
      this.router.navigate(["/questions"]).then((r) => {
        console.log(r);
      })
      console.log("navigateByUrl");

    }).catch((error) => {
      if (error.message === "Firebase: The email address is badly formatted. (auth/invalid-email)."){
        Notify.failure("L'adresse email n'est pas au bon format");
      } else if (error.message === "Firebase: There is no user record corresponding to this identifier. The user may have been deleted. (auth/user-not-found)."){
        Notify.failure("L'utilisateur n'existe pas");
      } else if (error.message === "Firebase: The password is invalid or the user does not have a password. (auth/wrong-password)."){
        Notify.failure("Le mot de passe est incorrect");
      } else {
        Notify.failure("Erreur d'authentification, vérifiez votre email et votre mot de passe");
      }
    });
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    if (user !== null){
      this.setIsUserLoggedIn$(true);
    } else {
      this.setIsUserLoggedIn$(false);
    }
    return this._isUserLoggedIn$.value;
  }

  signOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigateByUrl("/login");
      this.setIsUserLoggedIn$(false);
    });
  }
}
