import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Question } from '@models/question.model';
import { QuestionsService } from '@services/questions.service';

@Component({
  selector: 'app-export-button',
  templateUrl: './export-button.component.html',
  styleUrls: ['./export-button.component.scss']
})
export class ExportButtonComponent implements OnInit {

  @Input() public form!: FormGroup;

  constructor(private questionsService: QuestionsService) {
  }

  ngOnInit(): void {
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
    this.questionsService.getQuestions(this.form.get('difficulty')?.value, this.form.get('category')?.value).subscribe(
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
    this.questionsService.getQuestions(this.form.get('difficulty')?.value, this.form.get('category')?.value).subscribe(
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
