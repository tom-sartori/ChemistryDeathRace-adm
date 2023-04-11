import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, catchError, map, mapTo, Observable, of, switchMap, take, tap} from "rxjs";
import {Question} from "../models/question.model";
import {environment} from "../../environments/environment";
// import {environment} from "../../environments/environment.prod";

@Injectable()
export class QuestionsService {
  constructor(private http: HttpClient) {}

  private _loading$ = new BehaviorSubject<boolean>(false);
  get loading$(): Observable<boolean> {
    return this._loading$.asObservable();
  }

  private _questions$ = new BehaviorSubject<Question[]>([]);
  get questions$(): Observable<Question[]> {
    return this._questions$.asObservable();
  }

  private _categories$ = new BehaviorSubject<String[]>([]);
  get categories$(): Observable<String[]> {
    return this._categories$.asObservable();
  }

  private _difficulties$ = new BehaviorSubject<String[]>([]);
  get difficulties$(): Observable<String[]> {
    return this._difficulties$.asObservable();
  }

  private setLoadingStatus(loading: boolean) {
    this._loading$.next(loading);
  }

  saveQuestion(formValue: Question): Observable<boolean> {
    this.setLoadingStatus(true);
    return this.http.post(`${environment.apiUrl}/question`, formValue).pipe(
      mapTo(true),
      catchError(() => of(false).pipe()),
      tap(() => this.setLoadingStatus(false))
    );
  }

  getQuestionsFromServer(difficulty: string | null = null, category: string | null = null) {
    this.setLoadingStatus(true);

    let url = `${environment.apiUrl}/question`;
    if (difficulty) {
      url += `/difficulty/${difficulty}`;
      if (category) {
        url += `/category/${category}`;
      }
    }

    this.http.get<Question[]>(url).pipe(
      tap(games => {
        this._questions$.next(games);
        this.setLoadingStatus(false);
      })
    ).subscribe();
  }

  getDifficultiesFromServer() {
    this.setLoadingStatus(true);

    this.http.get<String[]>(`${environment.apiUrl}/question/difficulty`).pipe(
      tap(difficulties => {
        difficulties.sort();
        this._difficulties$.next(difficulties);
        this.setLoadingStatus(false);
      })
    ).subscribe();
  }

  getCategoriesFromServerByDifficulty(difficulty: string) {
    this.setLoadingStatus(true);

    this.http.get<String[]>(`${environment.apiUrl}/question/category/difficulty/${difficulty}`).pipe(
      tap(categories => {
        this._categories$.next(categories);
        this.setLoadingStatus(false);
      })
    ).subscribe();
  }

  getQuestionById(id: string): Observable<Question> {
    if (!this._questions$.value.length) {
      return this.http.get<Question>(`${environment.apiUrl}/question/id/${id}`);
    } else {
      return this.questions$.pipe(
        map(games => games.filter(game => game.id === id)[0])
      );
    }
  }

  deleteQuestion(id: string) {
    this.setLoadingStatus(true);
    this.http.delete(`${environment.apiUrl}/question/id/${id}`).pipe(
      switchMap(() => this.questions$),
      take(1),
      map(games => games.filter(game => game.id !== id)),
      tap(games => {
        this._questions$.next(games);
        this.setLoadingStatus(false);
      })
    ).subscribe();
  }

  updateQuestion(id: string, updatedGame: Question) {
    this.setLoadingStatus(true);
    return this.http.put(`${environment.apiUrl}/question/id/${id}`, updatedGame).pipe(
      mapTo(true),
      catchError(() => of(false).pipe()),
      tap(() => this.setLoadingStatus(false))
    );
  }
}
