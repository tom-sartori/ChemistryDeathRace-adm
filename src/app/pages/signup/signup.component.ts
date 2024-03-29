import { Component, OnInit } from '@angular/core';
import { AuthService } from '@services/auth.service';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackBarService } from '@services/snack-bar.service';


@Component({
  selector: 'app-auth-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  public registerForm: FormGroup;
  public emailCtrl: FormControl;
  public passwordCtrl: FormControl;
  public confirmCtrl: FormControl;

  public loading: boolean;
  public hide: boolean;

  constructor(public authService: AuthService,
              private router: Router,
              private snackBarService: SnackBarService
  ) {
    this.loading = false;
    this.hide = true;
    this.emailCtrl = new FormControl('', [Validators.required, Validators.email]);
    this.passwordCtrl = new FormControl('', [Validators.required, Validators.minLength(6)]);
    this.confirmCtrl = new FormControl('', [Validators.required, Validators.minLength(6)]);
    this.registerForm = new FormGroup({
      emailCtrl: this.emailCtrl,
      passwordCtrl: this.passwordCtrl,
      confirmCtrl: this.confirmCtrl
    }, {
      validators: this.matchValuesValidator('passwordCtrl', 'confirmCtrl'),
      updateOn: 'blur'
    });
  }

  ngOnInit(): void {
  }

  public changeHide(): void {
    this.hide = !this.hide;
  }

  public signUp(): void {
    this.loading = true;
    this.authService.signUp(this.emailCtrl.value, this.passwordCtrl.value)
      .subscribe(this.getObserver())
  }

  public onEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.signUp();
    }
  }

  private getObserver() {
    return {
      next: () => {
        this.router.navigateByUrl('/signin').then(() => {
          this.snackBarService.openSuccess('Votre compte a bien été créé');
        });
        this.loading = false;
      },
      error: () => {
        this.snackBarService.openError('Erreur lors de la création du compte');
        this.loading = false;
      }
    };
  }

  private matchValuesValidator(main: string, confirm: string): ValidatorFn {
    return (ctrl: AbstractControl): null | ValidationErrors => {
      if (!ctrl.get(main) || !ctrl.get(confirm)) {
        return {
          confirmEqual: 'Invalid control names'
        };
      }
      const mainValue = ctrl.get(main)!.value;
      const confirmValue = ctrl.get(confirm)!.value;

      return mainValue === confirmValue ? null : {
        confirmEqual: {
          main: mainValue,
          confirm: confirmValue
        }
      };
    };
  }
}
