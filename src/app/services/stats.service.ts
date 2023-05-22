import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, retry } from 'rxjs';
import { environment } from '@environments/environment';
import { Stat } from '@models/stat.model';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  private readonly serviceUrl: string;

  constructor(private http: HttpClient) {
    this.serviceUrl = `${environment.apiUrl}/game`
  }

  public getGamesPlayed(): Observable<number> {
    return this.http.get<number>(`${this.serviceUrl}/played`).pipe(
      retry(3)
    );
  }

  public getMostPlayedDifficulty(): Observable<string> {
    return this.http.get(`${this.serviceUrl}/most/played/difficulty`, {responseType: 'text'}).pipe(
      retry(3)
    );
  }

  public getGreatAnswerPercentage(): Observable<number> {
    return this.http.get<number>(`${this.serviceUrl}/percentage`).pipe(
      retry(3)
    );
  }

  public getAverageGameTime(): Observable<number> {
    return this.http.get<number>(`${this.serviceUrl}/average/time`).pipe(
      retry(3)
    );
  }

  public getAverageDiceSize(): Observable<number> {
    return this.http.get<number>(`${this.serviceUrl}/average/dicesize`).pipe(
      retry(3)
    );
  }

  public getAverageNumberOfPlayers(): Observable<number> {
    return this.http.get<number>(`${this.serviceUrl}/average/players`).pipe(
      retry(3)
    );
  }

  public getStatsByQuestion(): Observable<Stat[]> {
    return this.http.get<Stat[]>(`${this.serviceUrl}/percentage/question`).pipe(
      retry(3)
    );
  }

  public dropStats(): Observable<any> {
    return this.http.delete(`${this.serviceUrl}/drop`).pipe(
      retry(3)
    );
  }
}
