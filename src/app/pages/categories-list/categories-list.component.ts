import { Component, OnInit } from '@angular/core';
import { QuestionsService } from '@services/questions.service';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss']
})
export class CategoriesListComponent implements OnInit {

  selectedDifficulty!: string;
  difficulties!: string[];
  categories!: string[];

  loading: boolean;
  isEditing!: boolean[];
  editedCategory!: string;

  isEditingDifficulty: boolean;
  editedDifficulty!: string;

  constructor(private questionsService: QuestionsService) {
    this.loading = false;
    this.isEditingDifficulty = false;
  }

  ngOnInit(): void {
    this.loading = true;
    this.questionsService.getDifficultiesObservable().subscribe(
      (difficulties: string[]) => {
        this.difficulties = difficulties;
        this.selectedDifficulty = difficulties[0];
        this.onDifficultyChange(this.selectedDifficulty);
      }
    );
  }

  onDifficultyChange(difficulty: string) {
    this.selectedDifficulty = difficulty;
    this.questionsService.getCategoriesObservable(difficulty).subscribe(
      (categories: string[]) => {
        this.categories = categories;
        this.isEditing = new Array(categories.length).fill(false);
        this.loading = false;
      }
    );
  }

  startEditing(index: number) {
    for (let i = 0; i < this.isEditing.length; i++) {
      this.isEditing[i] = false;
    }
    this.isEditing[index] = true;
    this.editedCategory = this.categories[index];
  }

  saveCategory(index: number) {
    if (this.editedCategory === this.categories[index]) {
      this.isEditing[index] = false;
      return;
    }
    if (confirm("Voulez vous vraiment modifier la catégorie ? Cela modifiera la catégorie de toutes les questions correspondantes.")) {
      this.loading = true;
      this.questionsService.updateCategory(this.selectedDifficulty, this.categories[index], this.editedCategory).subscribe(() => {
        this.categories[index] = this.editedCategory;
        this.loading = false;
      });
    }
    this.isEditing[index] = false;
  }

  startEditingDifficulty() {
    this.isEditingDifficulty = true;
    this.editedDifficulty = this.selectedDifficulty;
  }

  saveDifficulty() {
    if (this.editedDifficulty === this.selectedDifficulty) {
      this.isEditingDifficulty = false;
      return;
    }
    if (confirm("Voulez vous vraiment modifier la difficulté ? Cela modifiera la difficulté de toutes les questions correspondantes.")) {
      this.loading = true;
      this.questionsService.updateDifficulty(this.selectedDifficulty, this.editedDifficulty).subscribe(() => {
        this.selectedDifficulty = this.editedDifficulty;
        this.questionsService.getDifficultiesObservable().subscribe(
          (difficulties: string[]) => {
            this.difficulties = difficulties;
            this.selectedDifficulty = this.editedDifficulty;
            this.onDifficultyChange(this.selectedDifficulty);
          }
        );
      });
    }
    this.isEditingDifficulty = false;
  }
}

