import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable, of, switchMap, tap } from "rxjs";
import { Question } from "../../models/question.model";
import { QuestionsService } from "../../services/questions.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Notify } from "notiflix/build/notiflix-notify-aio";

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
  difficultyCtrl!: FormControl;

  question$!: Observable<Question>;
  localDifficulties: string[] = [];
  localCategories: string[] = [];
  currentQuestionId!: string;
  currentDifficulty: string = '';

  constructor(private formBuilder: FormBuilder,
              private questionsService: QuestionsService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.initMainForm();
    this.initOptions();
    this.loading$ = this.questionsService.loading$;
    this.route.url.pipe(
      switchMap(() => {
        this.initDifficulties();
        return of(null);
      })
    ).subscribe();
  }

  private initDifficulties() {
    this.questionsService.getDifficultiesObservable().subscribe( x => {
      this.localDifficulties = x;
      this.questionsService.setLoadingStatus(false);
    });
  }

  private initMainForm(): void {
    this.categoryCtrl = this.formBuilder.control('');
    this.difficultyCtrl = this.formBuilder.control('');
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
    this.propositions.clear();
    this.questionsService.getDifficultiesFromServer();
  }

  private initOptions() {
    this.questionsService.getDifficultiesFromServer();
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
      difficulty: ['', Validators.required],
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
          difficulty: [question.difficulty, Validators.required],
          propositions: this.propositions
        });
        this.updateDifficulty(question.difficulty);
      })
    ).subscribe();
  }

  private saveQuestion() {
    let newQuestion: Question = {
      ...this.mainForm.value,
    }
    this.questionsService.saveQuestion(newQuestion).pipe(
      tap(saved => {
        if (saved) {
          this.resetForm();
          Notify.success("La question a bien été ajoutée")
        } else {
          Notify.failure("Une erreur est survenue lors de l'enregistrement de la question")
        }
      })
    ).subscribe();
  }

  private updateQuestion() {
    let updatedQuestion: Question = {
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

  removeAnswer(index: number): void {
    if (0 <= index && index < this.propositions.length) {
      if (this.propositions.controls[index].get('answer')?.value) {
        // If proposition is answer, set first proposition as answer.
        this.propositions.removeAt(index);
        this.propositions.controls[0].patchValue({answer: true});
      } else {
        this.propositions.removeAt(index);
      }
    }
  }

  updateCorrectAnswer(index: number) {
    this.propositions.controls.forEach((control) => {
      control.get('answer')?.setValue(false);
    });
    this.propositions.controls[index].patchValue({answer: true});
  }

  addCategoryLocally() {
    this.localCategories.push(this.categoryCtrl.value);
    this.categoryCtrl.setValue('');
  }

  addDifficultyLocally() {
    this.localDifficulties.push(this.difficultyCtrl.value);
    this.difficultyCtrl.setValue('');
  }

  updateDifficulty(newDifficulty: string) {
    this.currentDifficulty = newDifficulty;
    this.questionsService.getCategoriesObservable(newDifficulty).subscribe( x => {
      this.localCategories = x;
      this.questionsService.setLoadingStatus(false);
    });
  }

}
