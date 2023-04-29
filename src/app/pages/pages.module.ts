import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionsListComponent } from "./questions-list/questions-list.component";
import { QuestionFormComponent } from "./question-form/question-form.component";
import { ErrorComponent } from "./error/error.component";
import { SigninComponent } from "./signin/signin.component";
import {
  QuestionsListToolbarComponent
} from "./questions-list/questions-list-toolbar/questions-list-toolbar.component";
import { SignupComponent } from "./signup/signup.component";
import { SharedModule } from "../shared/shared.module";
import { QuestionsService } from "../services/questions.service";
import { AuthService } from "../services/auth.service";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {path: 'questions', component: QuestionsListComponent},
  {path: 'questions/add', component: QuestionFormComponent},
  {path: 'questions/update/:id', component: QuestionFormComponent},
  {path: 'error404', component: ErrorComponent},
  {path: 'signin', component: SigninComponent},
  {path: 'abcd/efgh/register', component: SignupComponent},
  {path: '', redirectTo: 'questions', pathMatch: 'full'},
  {path: '**', redirectTo: 'error404'}
];


@NgModule({
  declarations: [
    QuestionsListComponent,
    QuestionFormComponent,
    ErrorComponent,
    SigninComponent,
    QuestionsListToolbarComponent,
    SignupComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    QuestionsService,
    AuthService
  ]
})
export class PagesModule {
}
