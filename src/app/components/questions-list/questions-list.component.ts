import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {map, Observable} from "rxjs";
import {FormBuilder} from "@angular/forms";
import {Router} from "@angular/router";
import {Question} from "../../models/question.model";
import {QuestionsService} from "../../services/questions.service";
import {Notify} from "notiflix/build/notiflix-notify-aio";
import {QuestionsListToolbar} from "./questions-list-toolbar/questions-list-toolbar";

@Component({
  selector: 'app-questions-list',
  templateUrl: './questions-list.component.html',
  styleUrls: ['./questions-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionsListComponent implements OnInit {
  loading$!: Observable<boolean>;
  questions$!: Observable<Question[]>
  private filter: QuestionsListToolbar;

  constructor(
    private questionsService: QuestionsService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.filter = new QuestionsListToolbar('', null, null);
  }

  ngOnInit(): void {
    this.loading$ = this.questionsService.loading$;
    this.questions$ = this.questionsService.questions$;
    this.questionsService.getQuestionsFromServer();
  }

  onNewQuestion() {
    this.router.navigateByUrl("/questions/add")
  }

  onEditQuestion(id: string) {
    this.router.navigateByUrl("/questions/update/" + id)
  }

  onDeleteQuestion(id: string) {
    if (confirm("Voulez vous vraiment supprimer cette question ?")) {
      this.questions$.subscribe(
        (questions: Question[]) => {
          let question = questions.find(question => question.id === id);
          if (question) {
            this.questionsService.deleteQuestion(question.id);
            Notify.success('Question supprimé avec succès !')
          }
        });
    }
  }

  search(value: QuestionsListToolbar): void {
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
    this.questions$ = this.questionsService.questions$.pipe(
      map(questions => questions.filter(question => question.name.toLowerCase().includes(search)))
    );
  }

  private filterQuestions(difficulty: string | null, category: string | null) {
    this.questionsService.getQuestionsFromServer(difficulty, category);
  }
}
