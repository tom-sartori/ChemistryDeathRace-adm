import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {SharedModule} from "./shared/shared.module";
import {QuestionsListComponent} from "./components/questions-list/questions-list.component";
import {QuestionsService} from "./services/questions.service";
import {HttpClientModule} from "@angular/common/http";
import {ErrorComponent} from "./components/error/error.component";
import {HeaderComponent} from "./components/header/header.component";
import {AuthService} from "./services/auth.service";
import {firebaseConfig} from "../firebase-config";
import {AngularFireAuthModule} from "@angular/fire/compat/auth";
import {AngularFireModule} from "@angular/fire/compat";
import {QuestionFormComponent} from "./components/question-form/question-form.component";
import {SigninComponent} from "./components/signin/signin.component";
import {RouterModule} from "@angular/router";

@NgModule({
  declarations: [
    AppComponent,
    QuestionsListComponent,
    QuestionFormComponent,
    ErrorComponent,
    HeaderComponent,
    SigninComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    SharedModule,
    HttpClientModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    RouterModule
  ],
  exports: [
    AppRoutingModule
  ],
  providers: [
    QuestionsService,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
