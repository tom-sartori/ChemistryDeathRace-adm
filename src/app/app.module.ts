import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {SharedModule} from "./shared/shared.module";
import {QuestionsListComponent} from "./components/questions-list/questions-list.component";
import {QuestionsService} from "./services/questions.service";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {ErrorComponent} from "./components/error/error.component";
import {HeaderComponent} from "./components/header/header.component";
import {AuthService} from "./services/auth.service";
import {firebaseConfig} from "../firebase-config";
import {AngularFireAuthModule} from "@angular/fire/compat/auth";
import {AngularFireModule} from "@angular/fire/compat";
import {QuestionFormComponent} from "./components/question-form/question-form.component";
import {SigninComponent} from "./components/signin/signin.component";
import {RouterModule} from "@angular/router";
import {AuthInterceptor} from "./interceptors/auth.interceptor";
import { QuestionsListToolbarComponent } from './components/questions-list/questions-list-toolbar/questions-list-toolbar.component';

@NgModule({
  declarations: [
    AppComponent,
    QuestionsListComponent,
    QuestionFormComponent,
    ErrorComponent,
    HeaderComponent,
    SigninComponent,
    QuestionsListToolbarComponent
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
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
