import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { of, switchMap } from 'rxjs';
import { Question } from '@models/question.model';
import { QuestionsService } from '@services/questions.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LatexToUtf8Service } from '@services/latex-to-utf8.service';
import { MathfieldElement } from 'mathlive';
import { SnackBarService } from '@services/snack-bar.service';

@Component({
  selector: 'app-question-form',
  templateUrl: './question-form.component.html',
  styleUrls: ['./question-form.component.scss']
})
export class QuestionFormComponent implements OnInit, AfterViewInit {

  public loading: boolean

  mainForm!: FormGroup;
  propositions!: FormArray;

  categoryCtrl!: FormControl;
  difficultyCtrl!: FormControl;

  question!: Question;
  localDifficulties: string[];
  localCategories: string[];
  currentQuestionId!: string;
  currentDifficulty: string;

  @ViewChild('nameField')
  private nameField!: ElementRef;
  public nameMathField: MathfieldElement | undefined;

  private answerFields: HTMLElement[] = [];
  public answerMathFields: (MathfieldElement | undefined)[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private questionsService: QuestionsService,
    private router: Router,
    private route: ActivatedRoute,
    private latexToUtf8Service: LatexToUtf8Service,
    private snackBarService: SnackBarService
  ) {
    this.loading = false;
    this.localDifficulties = [];
    this.localCategories = [];
    this.currentDifficulty = '';
  }

  ngOnInit(): void {
    this.initMainForm();
    this.initOptions();
    this.route.url.pipe(
      switchMap(() => {
        this.initDifficulties();
        return of(null);
      })
    ).subscribe();
  }

  ngAfterViewInit() {
    MathfieldElement.fontsDirectory = null;
    MathfieldElement.soundsDirectory = null;

    if (this.router.url.includes('add')) {
      this.nameMathField = this.addMathField(this.nameField.nativeElement, this.mainForm.controls['name']);
      this.setPropositionMathField(0);
    }
  }

  private initDifficulties() {
    this.questionsService.getDifficulties().subscribe(x => {
      this.localDifficulties = x;
    });
  }

  private initMainForm(): void {
    this.categoryCtrl = this.formBuilder.control('');
    this.difficultyCtrl = this.formBuilder.control('');
    this.propositions = this.formBuilder.array([]);
    this.mainForm = this.formBuilder.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      difficulty: ['', Validators.required],
      propositions: this.propositions
    });
    if (this.router.url.includes('update')) {
      this.initUpdateForm();
    }
    else {
      this.addProposition();
    }
  }

  onSubmitForm(): void {
    if (this.mainForm.invalid) {
      this.snackBarService.openError('Veuillez remplir tous les champs obligatoires')
    }
    else {
      if (this.router.url === '/questions/add') {
        this.saveQuestion();
      }
      else {
        this.updateQuestion();
      }
    }
  }

  private resetForm() {
    this.mainForm.reset();
    this.propositions.clear();
    this.questionsService.getDifficulties().subscribe(x => {
      this.localDifficulties = x;
    });
  }

  private initOptions() {
    this.loading = true;
    this.questionsService.getDifficulties().subscribe(x => {
      this.localDifficulties = x;
      this.loading = false;
    });
  }

  private addProposition(name: string = '', answer: boolean = true) {
    this.propositions.push(this.formBuilder.group({
      name: [name, Validators.required],
      answer: [answer, Validators.required],
    }));
  }

  private initUpdateForm() {
    this.currentQuestionId = this.route.snapshot.paramMap.get('id')!;
    this.questionsService.getQuestionById(this.currentQuestionId).subscribe((question: Question) => {
      this.updateDifficulty(question.difficulty);
      for (let i = 0; i < question.propositions.length; i++) {
        this.addProposition(question.propositions[i].name, question.propositions[i].answer);
      }
      this.mainForm.patchValue({
        name: question.name,
        category: question.category,
        difficulty: question.difficulty,
      });

      this.loading = false;

      requestAnimationFrame(() => this.nameMathField = this.addMathField(this.nameField.nativeElement, this.mainForm.controls['name']));
      for (let i: number = 0; i < this.propositions.length; i++) {
        requestAnimationFrame(() => this.setPropositionMathField(i));
      }
    });
  }

  private saveQuestion() {
    let newQuestion: Question = {
      ...this.mainForm.value,
    }
    this.loading = true;
    this.questionsService.saveQuestion(newQuestion)
      .subscribe(this.getObserver(
        'Question crée avec succès',
        'Erreur lors de la création de la question'
      ));
  }

  private updateQuestion() {
    let updatedQuestion: Question = {
      ...this.mainForm.value,
      id: this.currentQuestionId
    }
    this.questionsService.updateQuestion(this.currentQuestionId, updatedQuestion)
      .subscribe(this.getObserver(
        'Question modifiée avec succès',
        'Erreur lors de la modification de la question'
      ));
  }

  private getObserver(successMessage: string, errorMessage: string) {
    return {
      next: (question: Question) => {
        this.resetForm();
        this.snackBarService.openSuccess(successMessage);
      },
      error: (err: any) => {
        this.snackBarService.openError(errorMessage);
      },
      complete: () => {
        this.loading = false;
        this.onGoBack();
      }
    }
  }

  public onGoBack() {
    this.router.navigateByUrl('/questions').then(() => {
      this.questionsService.getQuestions();
    })
  }

  public addAnswer() {
    this.propositions.push(this.formBuilder.group({
      name: ['', Validators.required],
      answer: [false, Validators.required],
    }));
  }

  public removeAnswer(index: number): void {
    if (0 <= index && index < this.propositions.length) {
      this.unsetPropositionMathField(index);
      if (this.propositions.controls[index].get('answer')?.value) {
        // If proposition is answer, set first proposition as answer.
        this.propositions.removeAt(index);
        this.propositions.controls[0].patchValue({answer: true});
      }
      else {
        this.propositions.removeAt(index);
      }
    }
  }

  public updateCorrectAnswer(index: number) {
    this.propositions.controls.forEach((control) => {
      control.get('answer')?.setValue(false);
    });
    this.propositions.controls[index].patchValue({answer: true});
  }

  public addCategoryLocally() {
    this.localCategories.push(this.categoryCtrl.value);
    this.categoryCtrl.setValue('');
  }

  public addDifficultyLocally() {
    this.localDifficulties.push(this.difficultyCtrl.value);
    this.difficultyCtrl.setValue('');
  }

  public updateDifficulty(newDifficulty: string) {
    this.currentDifficulty = newDifficulty;
    this.loading = true;
    this.questionsService.getCategories(newDifficulty).subscribe(x => {
      this.localCategories = x;
      this.loading = false;
    });
  }

  private addMathField(sibling: HTMLElement, formControl: AbstractControl<any>): MathfieldElement {
    let mfe: MathfieldElement = new MathfieldElement();
    mfe.setValue(formControl.value.replace(/ /g, '\\:'));
    mfe.style.width = '100%';
    mfe.style.backgroundColor = 'inherit';
    mfe.style.border = 'none';
    mfe.style.outline = 'none';
    mfe.mathModeSpace = '\\:';

    mfe.onclick = (): void => {
      sibling.focus();
      mfe.focus();
    }

    mfe.addEventListener('beforeinput', (ev) => {
      if (ev.inputType === 'insertFromPaste' && ev.data) {
        let paste: string = ev.data;
        paste = paste.replace(/ /g, '\\:');
        mfe.setValue(paste);
        ev.preventDefault();
      }
    });

    mfe.oninput = () => formControl.patchValue(this.latexToUtf8Service.convert(mfe?.value ?? formControl.value))
    sibling.style.height = '0';
    sibling.insertAdjacentElement('afterend', mfe);

    return mfe;
  }

  private setPropositionMathField(index: number) {
    this.answerFields.push(document.getElementById('answer' + index + 'Field')!);
    this.answerMathFields.push(this.addMathField(this.answerFields[index], this.propositions.controls[index].get('name')!));
  }

  private unsetPropositionMathField(index: number) {
    this.answerFields.splice(index, 1);
    this.answerMathFields.splice(index, 1);
  }
}
