import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { StatsService } from '@services/stats.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Stat } from '@models/stat.model';
import { SnackBarService } from '@services/snack-bar.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit, AfterViewInit {

  numberOfGamePlayed: number;
  mostPlayedDifficulty: string;
  greatAnswerPercentage: number;
  averageDiceSize: number;
  averageGameTime: number;
  numberOfPlayers: number;

  displayedColumns: string[];
  dataSource: MatTableDataSource<Stat>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private statsService: StatsService,
              private snackBarService: SnackBarService) {

    this.numberOfGamePlayed = -1;
    this.mostPlayedDifficulty = '';
    this.greatAnswerPercentage = -1;
    this.averageDiceSize = -1;
    this.averageGameTime = -1;
    this.numberOfPlayers = -1;
    this.dataSource = new MatTableDataSource<Stat>([]);

    this.getStats();
    this.displayedColumns = ['name', 'difficulty', 'percentage'];
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
    }
  }

  private getStats() {
    this.fetchStat(this.statsService.getGamesPlayed, 'Erreur lors du chargement du nombre de parties jouées', (data: number) => {
      this.numberOfGamePlayed = data;
    });

    this.fetchStat(this.statsService.getMostPlayedDifficulty, 'Erreur lors du chargement de la difficulté la plus jouée', (data: string) => {
      this.mostPlayedDifficulty = data;
    });

    this.fetchStat(this.statsService.getGreatAnswerPercentage, 'Erreur lors du chargement du pourcentage de bonnes réponses', (data: number) => {
      this.greatAnswerPercentage = data;
    });

    this.fetchStat(this.statsService.getAverageDiceSize, 'Erreur lors du chargement de la taille moyenne des dés', (data: number) => {
      this.averageDiceSize = data;
    });

    this.fetchStat(this.statsService.getAverageGameTime, 'Erreur lors du chargement de la durée moyenne des parties', (data: number) => {
      this.averageGameTime = data / 1000 / 60; // Convert milliseconds to minutes
    });

    this.fetchStat(this.statsService.getStatsByQuestion, 'Erreur lors du chargement des statistiques par question', (data: Stat[]) => {
      this.dataSource = new MatTableDataSource(data);
    });

    this.fetchStat(this.statsService.getAverageNumberOfPlayers, 'Erreur lors du chargement du nombre moyen de joueurs', (data: number) => {
      this.numberOfPlayers = data;
    });
  }

  private fetchStat(func: () => Observable<any>, errorMsg: string, successFunc: (data: any) => void) {
    func()
      .subscribe({
        next: successFunc,
        error: (error: any) => {
          this.snackBarService.openError(errorMsg);
        }
      });
  }

}
