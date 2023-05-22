import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, retry } from 'rxjs';
import { Question } from '@models/question.model';
import { environment } from '@environments/environment';

@Injectable()
export class QuestionsService {
  constructor(private http: HttpClient) {
  }

  saveQuestion(formValue: Question): Observable<Question> {
    return this.http.post<Question>(`${environment.apiUrl}/question`, formValue).pipe(
      retry(3)
    );
  }

  getQuestions(difficulty: string | null = null, category: string | null = null): Observable<Question[]> {
    let url = `${environment.apiUrl}/question`;
    if (difficulty) {
      url += `/difficulty/${this.urlEncodeParameter(difficulty)}`;
      if (category) {
        url += `/category/${this.urlEncodeParameter(category)}`;
      }
    }

    return this.http.get<Question[]>(url).pipe(
      retry(3)
    );
  }

  getDifficulties(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiUrl}/question/difficulty`).pipe(
      retry(3)
    );
  }

  getCategoriesFromServerByDifficulty(difficulty: string): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiUrl}/question/category/difficulty/${this.urlEncodeParameter(difficulty)}`).pipe(
      retry(3)
    );
  }

  getCategories(difficulty: string): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiUrl}/question/category/difficulty/${this.urlEncodeParameter(difficulty)}`).pipe(
      retry(3)
    );
  }

  getQuestionById(id: string): Observable<Question> {
    return this.http.get<Question>(`${environment.apiUrl}/question/id/${id}`).pipe(
      retry(3)
    );
  }

  deleteQuestion(id: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/question/id/${id}`).pipe(
      retry(3)
    );
  }

  updateQuestion(id: string, updatedGame: Question): Observable<Question> {
    return this.http.put<Question>(`${environment.apiUrl}/question/id/${id}`, updatedGame).pipe(
      retry(3)
    );
  }

  updateCategory(selectedDifficulty: string, oldCategory: string, editedCategory: string): Observable<string[]> {
    return this.http.put<string[]>(`${environment.apiUrl}/question/difficulty/${this.urlEncodeParameter(selectedDifficulty)}/category/${this.urlEncodeParameter(oldCategory)}`, editedCategory).pipe(
      retry(3)
    );
  }

  updateDifficulty(oldDifficulty: string, editedDifficulty: string): Observable<string[]> {
    return this.http.put<string[]>(`${environment.apiUrl}/question/difficulty/${this.urlEncodeParameter(oldDifficulty)}`, editedDifficulty).pipe(
      retry(3)
    );
  }

  private urlEncodeParameter(str: string): string {
    return str.replace(/ /g, '_');
  }
}
