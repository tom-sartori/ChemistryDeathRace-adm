import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Question } from '@models/question.model';
import { QuestionsService } from '@services/questions.service';
import { QuestionsListToolbar } from './questions-list-toolbar/questions-list-toolbar';
import { SnackBarService } from '@services/snack-bar.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-questions-list',
  templateUrl: './questions-list.component.html',
  styleUrls: ['./questions-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({height: '0px'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})
export class QuestionsListComponent implements OnInit {
  public loading: boolean;
  public displayedQuestions: MatTableDataSource<Question>;
  private questions: Question[];
  private filter: QuestionsListToolbar;

  public columnsToDisplay: string[];
  public columnsToDisplayWithExpand: string[];
  public expandedQuestion: Question | null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private questionsService: QuestionsService,
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBarService: SnackBarService,
    private cdr: ChangeDetectorRef
  ) {
    this.loading = true;
    this.questions = [];
    this.displayedQuestions = new MatTableDataSource<Question>([]);
    this.filter = new QuestionsListToolbar('', null, null);

    this.columnsToDisplay = ['name', 'difficulty', 'category'];
    this.columnsToDisplayWithExpand = [...this.columnsToDisplay, 'action']
    this.expandedQuestion = null;
  }

  ngOnInit(): void {
    this.getQuestions();
  }

  private getQuestions(difficulty: string | null = null, category: string | null = null): void {
    this.loading = true;
    this.questionsService.getQuestions(difficulty, category)
      .subscribe(this.getObserver((questions: Question[]) => {
        this.questions = questions;
        this.displayedQuestions = new MatTableDataSource<Question>(questions);
        this.cdr.detectChanges();
        this.displayedQuestions.paginator = this.paginator;
        this.displayedQuestions.sort = this.sort;
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
    this.displayedQuestions.data = this.questions.filter(question => {
      return question.name.toLowerCase().includes(search.toLowerCase());
    });
  }

  private filterQuestions(difficulty: string | null, category: string | null) {
    this.getQuestions(difficulty, category);
  }

  private getObserver(nextFunc: (data: any) => void, errorMessage: string) {
    return {
      next: (data: any) => {
        nextFunc(data);
        this.loading = false;
      },
      error: () => {
        this.snackBarService.openError(errorMessage);
        this.loading = false;
      }
    };
  }

  public toggleRow(row: Question, event: Event) {
    this.expandedQuestion = this.expandedQuestion === row ? null : row;
    event.stopPropagation();
  }
}
