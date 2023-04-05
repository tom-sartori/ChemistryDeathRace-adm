import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {FormControl, Validators} from "@angular/forms";


@Component({
  selector: 'app-auth',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  emailCtrl!: FormControl;
  passwordCtrl!: FormControl;

  hide: boolean = true;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.emailCtrl = new FormControl('', [Validators.required, Validators.email]);
    this.passwordCtrl = new FormControl('', [Validators.required, Validators.minLength(6)]);
  }

  changeHide() {
    this.hide = !this.hide;
  }

  signIn() {
    this.authService.signIn(this.emailCtrl.value, this.passwordCtrl.value);
  }
}
