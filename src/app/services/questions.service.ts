import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Question } from '@models/question.model';
import { environment } from '@environments/environment';

@Injectable()
export class QuestionsService {
  constructor(private http: HttpClient) {
  }

  saveQuestion(formValue: Question): Observable<Question> {
    return this.http.post<Question>(`${environment.apiUrl}/question`, formValue);
  }

  getQuestions(difficulty: string | null = null, category: string | null = null): Observable<Question[]> {
    let url = `${environment.apiUrl}/question`;
    if (difficulty) {
      url += `/difficulty/${difficulty}`;
      if (category) {
        url += `/category/${category}`;
      }
    }

    return this.http.get<Question[]>(url);
  }

  getDifficulties(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiUrl}/question/difficulty`);
  }

  getCategoriesFromServerByDifficulty(difficulty: string): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiUrl}/question/category/difficulty/${difficulty}`);
  }

  getCategories(difficulty: string): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiUrl}/question/category/difficulty/${difficulty}`);
  }

  getQuestionById(id: string): Observable<Question> {
    return this.http.get<Question>(`${environment.apiUrl}/question/id/${id}`);
  }

  deleteQuestion(id: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/question/id/${id}`);
  }

  updateQuestion(id: string, updatedGame: Question): Observable<Question> {
    return this.http.put<Question>(`${environment.apiUrl}/question/id/${id}`, updatedGame);
  }

  updateCategory(selectedDifficulty: string, oldCategory: string, editedCategory: string): Observable<string[]> {
    return this.http.put<string[]>(`${environment.apiUrl}/question/difficulty/${selectedDifficulty}/category/${oldCategory}`, editedCategory);
  }

  updateDifficulty(oldDifficulty: string, editedDifficulty: string): Observable<string[]> {
    return this.http.put<string[]>(`${environment.apiUrl}/question/difficulty/${oldDifficulty}`, editedDifficulty);
  }
}
