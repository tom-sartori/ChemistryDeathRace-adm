import { Component, OnInit } from '@angular/core';
import { AuthService } from '@services/auth.service';
import { FormControl, Validators } from '@angular/forms';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Router } from '@angular/router';


@Component({
  selector: 'app-auth-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  emailCtrl: FormControl;
  passwordCtrl: FormControl;

  loading: boolean
  hide: boolean;

  constructor(public authService: AuthService, private router: Router) {
    this.loading = false;
    this.hide = true;
    this.emailCtrl = new FormControl('', [Validators.required, Validators.email]);
    this.passwordCtrl = new FormControl('', [Validators.required, Validators.minLength(6)]);
  }

  ngOnInit(): void {
  }

  public changeHide(): void {
    this.hide = !this.hide;
  }

  public signIn(): void {
    this.loading = true;
    this.authService.get().subscribe((responseEnable) => {
      if (responseEnable.enable) {
        this.authService.signIn(this.emailCtrl.value, this.passwordCtrl.value).subscribe((response) => {
          if (response.token) {
            localStorage.setItem('token', JSON.stringify(response));
            this.authService.setIsUserLoggedIn(true);
            document.dispatchEvent(new Event('logged-in'));
            this.router.navigateByUrl('/questions').catch((error) => {
              Notify.failure('Erreur de redirection : ' + error.message);
            });
          }
          else {
            Notify.failure('Erreur d\'authentification');
          }
          this.loading = false;
        });
      }
      else {
        this.loading = false;
        Notify.failure('Erreur serveur');
      }
    })
  }

  public onEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.signIn();
    }
  }

}
