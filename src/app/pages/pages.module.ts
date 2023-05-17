import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableExporterModule } from 'mat-table-exporter';
import { QuestionsListComponent } from './questions-list/questions-list.component';
import { QuestionFormComponent } from './question-form/question-form.component';
import { ErrorComponent } from './error/error.component';
import { SigninComponent } from './signin/signin.component';
import {
  QuestionsListToolbarComponent
} from './questions-list/questions-list-toolbar/questions-list-toolbar.component';
import { SignupComponent } from './signup/signup.component';
import { SharedModule } from '@shared/shared.module';
import { QuestionsService } from '@services/questions.service';
import { AuthService } from '@services/auth.service';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesListComponent } from './categories-list/categories-list.component';
import { StatsComponent } from './stats/stats.component';
import { StatsService } from '@services/stats.service';
import { StatTileComponent } from './stats/stat-tile/stat-tile.component';
import { SnackBarService } from '@services/snack-bar.service';
import { ExportButtonComponent } from './questions-list/questions-list-toolbar/export-button/export-button.component';
import { CustomPaginatorIntl } from '@services/paginator-init.service';
import { MatPaginatorIntl } from '@angular/material/paginator';

const routes: Routes = [
  {path: 'questions', component: QuestionsListComponent},
  {path: 'questions/add', component: QuestionFormComponent},
  {path: 'questions/update/:id', component: QuestionFormComponent},
  {path: 'categories', component: CategoriesListComponent},
  {path: 'stats', component: StatsComponent},
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
    SignupComponent,
    CategoriesListComponent,
    StatsComponent,
    StatTileComponent,
    ExportButtonComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    RouterModule.forChild(routes),
    MatTableExporterModule
  ],
  providers: [
    QuestionsService,
    AuthService,
    StatsService,
    SnackBarService,
    {provide: MatPaginatorIntl, useClass: CustomPaginatorIntl}
  ]
})
export class PagesModule {
}
