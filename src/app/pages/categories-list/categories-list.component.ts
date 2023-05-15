import { Component, OnInit } from '@angular/core';
import { QuestionsService } from '@services/questions.service';
import { SnackBarService } from '@services/snack-bar.service';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss']
})
export class CategoriesListComponent implements OnInit {

  public selectedDifficulty!: string;
  public difficulties!: string[];
  public categories!: string[];

  public loading: boolean;
  public isEditing!: boolean[];
  public editedCategory!: string;

  public isEditingDifficulty: boolean;
  public editedDifficulty!: string;

  constructor(private questionsService: QuestionsService,
              private snackBarService: SnackBarService,
  ) {
    this.loading = false;
    this.isEditingDifficulty = false;
  }

  ngOnInit(): void {
    this.loading = true;
    this.questionsService.getDifficulties().subscribe(this.getObserver(difficulties => {
      this.difficulties = difficulties;
      this.selectedDifficulty = difficulties[0];
      this.onDifficultyChange(this.selectedDifficulty);
    }, 'Erreur lors du chargement des difficultés'));
  }

  public onDifficultyChange(difficulty: string) {
    this.selectedDifficulty = difficulty;
    this.questionsService.getCategories(difficulty).subscribe(this.getObserver(categories => {
      this.categories = categories;
      this.isEditing = new Array(categories.length).fill(false);
    }, 'Erreur lors du chargement des catégories'));
  }

  public startEditing(type: 'category' | 'difficulty', index?: number) {
    if (type === 'category') {
      this.setEditing(index!, true);
      this.editedCategory = this.categories[index!];
    }
    else if (type === 'difficulty') {
      this.isEditingDifficulty = true;
      this.editedDifficulty = this.selectedDifficulty;
    }
  }

  private getObserver(successFunc: (data: any) => void, errorMsg: string) {
    return {
      next: successFunc,
      error: () => {
        this.snackBarService.openError(errorMsg);
      },
      complete: () => {
        this.loading = false;
      }
    };
  }

  public saveCategory(index: number) {
    if (this.editedCategory === this.categories[index]) {
      this.setEditing(index, false);
      return;
    }

    if (confirm('Voulez vous vraiment modifier la catégorie ? Cela modifiera la catégorie de toutes les questions correspondantes.')) {
      this.loading = true;
      this.questionsService.updateCategory(this.selectedDifficulty, this.categories[index], this.editedCategory)
        .subscribe({
          next: () => {
            this.categories[index] = this.editedCategory;
            this.snackBarService.openSuccess('Catégorie mise à jour');
          },
          error: () => {
            this.snackBarService.openError('Erreur lors de la mise à jour de la catégorie');
          },
          complete: () => {
            this.loading = false;
          }
        });
    }
    this.setEditing(index, false);
  }

  private setEditing(index: number, editing: boolean) {
    for (let i = 0; i < this.isEditing.length; i++) {
      this.isEditing[i] = false;
    }
    this.isEditing[index] = editing;
  }

  public saveDifficulty() {
    if (this.editedDifficulty === this.selectedDifficulty) {
      this.isEditingDifficulty = false;
      return;
    }

    if (confirm('Voulez vous vraiment modifier la difficulté ? Cela modifiera la difficulté de toutes les questions correspondantes.')) {
      this.loading = true;
      this.questionsService.updateDifficulty(this.selectedDifficulty, this.editedDifficulty)
        .subscribe({
          next: () => {
            this.selectedDifficulty = this.editedDifficulty;
            this.selectedDifficulty = this.editedDifficulty;
            this.questionsService.getDifficulties().subscribe(this.getObserver(difficulties => {
              this.difficulties = difficulties;
              this.selectedDifficulty = this.editedDifficulty;
              this.onDifficultyChange(this.selectedDifficulty);
            }, 'Erreur lors de la mise à jour des difficultés'));
            this.snackBarService.openSuccess('Difficulté mise à jour');
          },
          error: () => {
            this.snackBarService.openError('Erreur lors de la mise à jour de la difficulté');
          }
        });
    }
    this.isEditingDifficulty = false;
  }
}

