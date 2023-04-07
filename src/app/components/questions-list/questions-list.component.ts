import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {combineLatest, map, Observable, startWith} from "rxjs";
import {FormBuilder, FormControl} from "@angular/forms";
import {Router} from "@angular/router";
import {Question} from "../../models/question.model";
import {QuestionsService} from "../../services/questions.service";
import {QuestionSearchType} from "../../enums/question-search-type.enum";
import {Notify} from "notiflix/build/notiflix-notify-aio";

@Component({
  selector: 'app-questions-list',
  templateUrl: './questions-list.component.html',
  styleUrls: ['./questions-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionsListComponent implements OnInit {

  loading$!: Observable<boolean>;
  questions$!: Observable<Question[]>
  searchCtrl!: FormControl;
  searchTypeCtrl!: FormControl;
  searchTypeOptions!: {
    value: QuestionSearchType,
    label: string
  }[];

  constructor(private questionsService: QuestionsService,
              private formBuilder: FormBuilder,
              private router: Router) { }

  ngOnInit(): void {
    this.initForm();
    this.questionsService.getQuestionsFromServer();
    this.initObservables();
    this.questionsService.questions$.subscribe();
    this.searchTypeOptions = [
      { value: QuestionSearchType.QUESTION, label: 'Question' },
      { value: QuestionSearchType.CATEGORY, label: 'Catégorie' },
      { value: QuestionSearchType.DIFFICULTY, label: 'Difficulté' }
    ]
  }

  private initObservables() {
    this.loading$ = this.questionsService.loading$;
    this.questions$ = this.questionsService.questions$;
    const search$ = this.searchCtrl.valueChanges.pipe(
      startWith(this.searchCtrl.value),
      map(value => value.toLowerCase())
    );
    const searchType$: Observable<QuestionSearchType> = this.searchTypeCtrl.valueChanges.pipe(
      startWith(this.searchTypeCtrl.value)
    );
    this.questions$ = combineLatest([
        search$,
        searchType$,
        this.questionsService.questions$
      ]
    ).pipe(
      map(([search, searchType, games]) => games.filter(game => game[searchType]
        .toLowerCase()
        .includes(search as string))
      )
    );
  }

  private initForm() {
    this.searchCtrl = this.formBuilder.control((''));
    this.searchTypeCtrl = this.formBuilder.control((QuestionSearchType.QUESTION));
  }

  onNewQuestion() {
    this.router.navigateByUrl("/questions/add")
  }

  onEditQuestion(id: string) {
    this.router.navigateByUrl("/questions/update/" + id)
  }

  onDeleteQuestion(id: string) {
    if (confirm("Voulez vous vraiment supprimer cette question ?")){
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
}
