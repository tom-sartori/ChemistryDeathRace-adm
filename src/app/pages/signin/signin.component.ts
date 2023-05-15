import { Component, OnInit } from '@angular/core';
import { AuthService } from '@services/auth.service';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackBarService } from '@services/snack-bar.service';


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

  constructor(public authService: AuthService,
              private router: Router,
              private snackBarService: SnackBarService
  ) {
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
    this.authService.get()
      .subscribe(this.getObserverEnable())
  }

  private getObserverEnable() {
    return {
      next: () => {
        this.authService.signIn(this.emailCtrl.value, this.passwordCtrl.value)
          .subscribe(this.getObserverSignIn());
      },
      error: () => {
        this.snackBarService.openError('Erreur lors de la connexion');
      },
      complete: () => {
        this.loading = false;
      }
    };
  }

  private getObserverSignIn() {
    return {
      next: (response: any) => {
        localStorage.setItem('token', JSON.stringify(response));
        this.authService.setIsUserLoggedIn(true);
        document.dispatchEvent(new Event('logged-in'));
        this.router.navigateByUrl('/questions');
      },
      error: () => {
        this.snackBarService.openError('Erreur lors de la connexion');
      }
    };
  }

  public onEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.signIn();
    }
  }

}
