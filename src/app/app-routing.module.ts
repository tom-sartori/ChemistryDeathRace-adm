import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {QuestionsListComponent} from "./components/questions-list/questions-list.component";
import {ErrorComponent} from "./components/error/error.component";
import {QuestionFormComponent} from "./components/question-form/question-form.component";
import {SigninComponent} from "./components/signin/signin.component";
import {AuthGuard} from "./shared/guard/auth.guard";
import {SignupComponent} from "./components/signup/signup.component";

const routes: Routes = [
  { path: 'questions', component: QuestionsListComponent, canActivate: [AuthGuard]},
  { path: 'questions/add', component: QuestionFormComponent, canActivate: [AuthGuard]},
  { path: 'questions/update/:id', component: QuestionFormComponent, canActivate: [AuthGuard]},
  { path: 'error404', component: ErrorComponent},
  { path: 'signin', component: SigninComponent},
  { path: 'abcd/efgh/register', component: SignupComponent},
  { path: '', redirectTo: 'questions', pathMatch: 'full'},
  { path: '**', redirectTo: 'error404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
