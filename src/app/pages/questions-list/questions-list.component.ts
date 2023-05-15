import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Question } from '@models/question.model';
import { QuestionsService } from '@services/questions.service';
import { QuestionsListToolbar } from './questions-list-toolbar/questions-list-toolbar';
import { SnackBarService } from '@services/snack-bar.service';

@Component({
  selector: 'app-questions-list',
  templateUrl: './questions-list.component.html',
  styleUrls: ['./questions-list.component.scss']
})
export class QuestionsListComponent implements OnInit {
  public loading: boolean;
  public displayedQuestions: Question[];
  private questions: Question[];
  private filter: QuestionsListToolbar;

  constructor(
    private questionsService: QuestionsService,
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBarService: SnackBarService
  ) {
    this.loading = true;
    this.questions = [];
    this.displayedQuestions = [];
    this.filter = new QuestionsListToolbar('', null, null);
  }

  ngOnInit(): void {
    this.getQuestions();
  }

  private getQuestions(difficulty: string | null = null, category: string | null = null): void {
    this.questionsService.getQuestions(difficulty, category)
      .subscribe(this.getObserver((questions: Question[]) => {
        this.questions = questions;
        this.displayedQuestions = questions;
      }, 'Erreur lors du chargement des questions'));
  }

  public onNewQuestion() {
    this.router.navigateByUrl('/questions/add')
  }

  public onEditQuestion(id: string) {
    this.router.navigateByUrl('/questions/update/' + id)
  }

  public onDeleteQuestion(id: string) {
    if (confirm('Voulez vous vraiment supprimer cette question ?')) {
      this.loading = true;
      this.questionsService.deleteQuestion(id)
        .subscribe(this.getObserver(() => this.getQuestions(), 'Erreur lors de la suppression de la question'));
    }
  }

  public search(value: QuestionsListToolbar): void {
    if (value.difficulty !== this.filter.difficulty) {
      value.category = null;
    }
    if (value.difficulty !== this.filter.difficulty || value.category !== this.filter.category) {
      this.filterQuestions(value.difficulty, value.category);
    }
    if (value.questionName !== this.filter.questionName) {
      this.filterByQuestionName(value.questionName)
    }
    this.filter = value;
  }

  private filterByQuestionName(search: string) {
    this.displayedQuestions = this.questions.filter(question => {
      return question.name.toLowerCase().includes(search.toLowerCase());
    });
  }

  private filterQuestions(difficulty: string | null, category: string | null) {
    this.getQuestions(difficulty, category);
  }

  private getObserver(nextFunc: (data: any) => void, errorMessage: string) {
    return {
      next: nextFunc,
      error: () => {
        this.snackBarService.openError(errorMessage);
      },
      complete: () => {
        this.loading = false;
      }
    };
  }
}
