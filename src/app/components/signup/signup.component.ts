import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {Observable} from "rxjs";


@Component({
  selector: 'app-auth-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  registerForm!: FormGroup;
  emailCtrl!: FormControl;
  passwordCtrl!: FormControl;
  confirmCtrl!: FormControl;

  loading$!: Observable<boolean>

  hide: boolean = true;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
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
    this.loading$ = this.authService.loading$;
  }

  matchValuesValidator(main: string, confirm: string): ValidatorFn {
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

  changeHide() {
    this.hide = !this.hide;
  }

  signUp() {
    this.authService.signUp(this.emailCtrl.value, this.passwordCtrl.value);
  }

  onEnter(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.signUp();
    }
  }
}
