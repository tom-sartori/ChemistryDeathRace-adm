import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { QuestionsListToolbar } from './questions-list-toolbar';
import { QuestionsService } from '@services/questions.service';
import { Question } from '@models/question.model';

@Component({
  selector: 'app-questions-list-toolbar',
  templateUrl: './questions-list-toolbar.component.html',
  styleUrls: ['./questions-list-toolbar.component.scss']
})
export class QuestionsListToolbarComponent implements OnInit {
  @Output() onSearch: EventEmitter<QuestionsListToolbar> = new EventEmitter<QuestionsListToolbar>();

  public form!: FormGroup;

  public difficulties: String[] = [];
  public categories: String[] = [];

  constructor(
    public formBuilder: FormBuilder,
    public questionsService: QuestionsService
  ) {
  }

  ngOnInit(): void {
    this.initForm();
    this.setDifficulties();
  }

  private initForm(): void {
    this.form = this.formBuilder.group({
      questionName: '',
      difficulty: [null],
      category: [null]
    });

    this.form.valueChanges.subscribe(value => {
      this.onSearch.emit(value);
      this.setCategories(value.difficulty);
    });
  }

  private setDifficulties(): void {
    this.questionsService.getDifficultiesFromServer();
    this.questionsService.difficulties$.subscribe(difficulties => this.difficulties = difficulties);
  }

  private setCategories(difficulty: string): void {
    this.questionsService.getCategoriesFromServerByDifficulty(difficulty);
    this.questionsService.categories$.subscribe(categories => this.categories = categories);
  }


  public onExport(type: string) {
    switch (type) {
      case 'csv':
        this.exportQuestionsToCsv();
        break;
      case 'json':
        this.exportQuestionsToJson();
        break;
      default:
        break;
    }
  }

  private exportQuestionsToJson() {
    const fileName: string = 'questions-' + new Date().toISOString() + '.json';
    this.questionsService.getQuestionsFromServerObservable(this.form.get('difficulty')?.value, this.form.get('category')?.value).subscribe(
      (questions: Question[]) => {
        const file = new Blob([JSON.stringify(questions)], {type: 'application/json'});

        const link = document.createElement('a');
        link.href = URL.createObjectURL(file);
        link.download = fileName;
        link.click();
        link.remove();
      }
    )
  }

  private exportQuestionsToCsv() {
    const fileName: string = 'questions-' + new Date().toISOString() + '.csv';
    this.questionsService.getQuestionsFromServerObservable(this.form.get('difficulty')?.value, this.form.get('category')?.value).subscribe(
      (questions: Question[]) => {
        const data = this.convertJSONtoCSV(questions);
        const file = new Blob([data], {type: 'text/csv'});

        const link = document.createElement('a');
        link.href = URL.createObjectURL(file);
        link.download = fileName;
        link.click();
        link.remove();
      }
    )
  }

  private convertJSONtoCSV(jsonData: any[]): string {
    const csvRows: string[] = [];

    const headers = ['id', 'question', 'catégorie', 'difficulté', 'réponse 1', 'réponse 2', 'réponse 3', 'réponse 4', 'bonne réponse'];
    csvRows.push(headers.join(','));

    for (const row of jsonData) {
      const values: string[] = [
        row.id,
        row.name,
        row.category,
        row.difficulty,
      ];

      const propositions = row.propositions || [];
      for (let i = 0; i < 4; i++) {
        const proposition = propositions[i] || {};
        values.push(proposition.name || '');
      }

      values.push(propositions.find((p: any) => p.answer)?.name || '');

      csvRows.push(values.map((value) => `"${value}"`).join(','));
    }

    return csvRows.join('\n');
  }
}
