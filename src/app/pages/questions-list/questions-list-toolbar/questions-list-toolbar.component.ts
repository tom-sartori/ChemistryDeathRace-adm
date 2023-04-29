import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { QuestionsListToolbar } from "./questions-list-toolbar";
import { QuestionsService } from "../../../services/questions.service";

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
}
