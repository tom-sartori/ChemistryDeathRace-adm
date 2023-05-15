import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
    return this.http.get<number>(`${this.serviceUrl}/played`);
  }

  public getMostPlayedDifficulty(): Observable<string> {
    return this.http.get(`${this.serviceUrl}/most/played/difficulty`, {responseType: 'text'});
  }

  public getGreatAnswerPercentage(): Observable<number> {
    return this.http.get<number>(`${this.serviceUrl}/percentage`);
  }

  public getAverageGameTime(): Observable<number> {
    return this.http.get<number>(`${this.serviceUrl}/average/time`);
  }

  public getAverageDiceSize(): Observable<number> {
    return this.http.get<number>(`${this.serviceUrl}/average/dicesize`);
  }

  public getAverageNumberOfPlayers(): Observable<number> {
    return this.http.get<number>(`${this.serviceUrl}/average/players`);
  }

  public getStatsByQuestion(): Observable<Stat[]> {
    return this.http.get<Stat[]>(`${this.serviceUrl}/percentage/question`);
  }
}
