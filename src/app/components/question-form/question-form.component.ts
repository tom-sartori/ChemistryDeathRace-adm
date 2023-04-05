import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Observable, switchMap, tap} from "rxjs";
import {Question} from "../../models/question.model";
import {QuestionsService} from "../../services/questions.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Notify} from "notiflix/build/notiflix-notify-aio";

@Component({
  selector: 'app-question-form',
  templateUrl: './question-form.component.html',
  styleUrls: ['./question-form.component.scss']
})
export class QuestionFormComponent implements OnInit {

  loading$!: Observable<boolean>

  mainForm!: FormGroup;
  propositions!: FormArray;

  categoryCtrl!: FormControl;

  question$!: Observable<Question>;
  categories$!: Observable<String[]>;
  currentQuestionId!: string;

  constructor(private formBuilder: FormBuilder,
              private questionsService: QuestionsService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.initMainForm();
    this.initOptions();
    this.categories$ = this.questionsService.categories$;
    this.loading$ = this.questionsService.loading$;
  }

  private initMainForm(): void {
    this.categoryCtrl = this.formBuilder.control('');
    if (this.router.url === "/questions/add") {
      this.initAddForm();
    } else {
      this.initUpdateForm();
    }
  }

  onSubmitForm() {
    if (this.router.url === "/questions/add") {
      this.saveQuestion();
    } else {
      this.updateQuestion();
    }
    this.onGoBack();
  }

  private resetForm(){
    this.mainForm.reset();
  }

  private initOptions() {
    this.questionsService.getCategoriesFromServer();
  }

  private initAddForm() {
    this.propositions = this.formBuilder.array([
      this.formBuilder.group({
        name: ['', Validators.required],
        answer: [true, Validators.required],
      }
    )]);
    this.mainForm = this.formBuilder.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      propositions: this.propositions
    });
  }

  private initUpdateForm() {
    this.question$ = this.route.params.pipe(
      tap(params => {
          this.currentQuestionId = params['id'];
        }
      ),
      switchMap(params => this.questionsService.getQuestionById(params['id']))
    );
    this.question$.pipe(
      tap((question: Question) => {
        this.propositions = this.formBuilder.array(question.propositions.map(proposition => {
          return this.formBuilder.group({
            name: [proposition.name, Validators.required],
            answer: [proposition.answer, Validators.required],
          })
        }));
        this.mainForm = this.formBuilder.group({
          name: [question.name, Validators.required],
          category: [question.category, Validators.required],
          propositions: this.propositions
        });
      })
    ).subscribe();
  }

  private saveQuestion() {
    let newQuestion : Question = {
      ...this.mainForm.value,
    }
    this.questionsService.saveQuestion(newQuestion).pipe(
      tap(saved => {
        if (saved) {
          this.resetForm();
          Notify.success("La question a bien été ajoutée")
        } else {
          Notify.failure("Une erreur est survenue lors de l'enregistrement de la question")
          console.log("An error as occurred during saving data")
        }
      })
    ).subscribe();
  }

  private updateQuestion() {
    let updatedQuestion : Question = {
      ...this.mainForm.value,
      id: this.currentQuestionId
    }
    this.questionsService.updateQuestion(this.currentQuestionId, updatedQuestion).pipe(
      tap(saved => {
        if (saved) {
          this.resetForm();
          Notify.success("La question a bien été modifiée")
        } else {
          Notify.failure("Une erreur est survenue lors de l'enregistrement de la question")
          console.log("An error as occurred during saving data")
        }
      })
    ).subscribe();
  }

  onGoBack() {
    this.router.navigateByUrl('/questions').then(() => {
      this.questionsService.getQuestionsFromServer();
    })
  }

  addAnswer() {
    this.propositions.push(this.formBuilder.group({
      name: ['', Validators.required],
      answer: [false, Validators.required],
    }));
  }

  removeAnswer() {
    this.propositions.removeAt(this.propositions.length - 1);
  }

  updateCorrectAnswer(index: number) {
    this.propositions.controls.forEach((control) => {
      control.get('answer')?.setValue(false);
    });
    this.propositions.controls[index].patchValue({ answer: true });
  }

  addCategoryLocaly() {
    this.questionsService.categories$.pipe(
      tap(categories => {
        categories.push(this.categoryCtrl.value);
      })
    ).subscribe();
    this.categoryCtrl.setValue('');
  }

}
