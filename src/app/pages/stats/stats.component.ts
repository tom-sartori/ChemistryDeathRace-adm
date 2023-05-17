import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { StatsService } from '@services/stats.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Stat } from '@models/stat.model';
import { SnackBarService } from '@services/snack-bar.service';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {

  public loading: boolean;

  public numberOfGamePlayed: number;
  public mostPlayedDifficulty: string;
  public greatAnswerPercentage: number;
  public averageDiceSize: number;
  public averageGameTime: number;
  public numberOfPlayers: number;

  public displayedColumns: string[];
  public stats: MatTableDataSource<Stat>;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) statPaginator!: MatPaginator;

  constructor(private statsService: StatsService,
              private snackBarService: SnackBarService,
              private cdr: ChangeDetectorRef) {

    this.numberOfGamePlayed = -1;
    this.mostPlayedDifficulty = '';
    this.greatAnswerPercentage = -1;
    this.averageDiceSize = -1;
    this.averageGameTime = -1;
    this.numberOfPlayers = -1;
    this.stats = new MatTableDataSource<Stat>([]);

    this.loading = true;

    this.getStats();
    this.displayedColumns = ['name', 'difficulty', 'percentage'];
  }

  ngOnInit(): void {
  }

  private getStats() {
    this.statsService.getGamesPlayed().subscribe(this.getObserver('Erreur lors du chargement du nombre de parties jouées', (data: number) => {
      this.numberOfGamePlayed = data;
    }));

    this.statsService.getMostPlayedDifficulty().subscribe(this.getObserver('Erreur lors du chargement de la difficulté la plus jouée', (data: string) => {
      this.mostPlayedDifficulty = data;
    }));

    this.statsService.getGreatAnswerPercentage().subscribe(this.getObserver('Erreur lors du chargement du pourcentage de bonnes réponses', (data: number) => {
      this.greatAnswerPercentage = data;
    }));

    this.statsService.getAverageDiceSize().subscribe(this.getObserver('Erreur lors du chargement de la taille moyenne des dés', (data: number) => {
      this.averageDiceSize = data;
    }));

    this.statsService.getAverageGameTime().subscribe(this.getObserver('Erreur lors du chargement de la durée moyenne des parties', (data: number) => {
      this.averageGameTime = data / 1000 / 60; // Convert milliseconds to minutes
    }));

    this.statsService.getStatsByQuestion().subscribe(this.getObserver('Erreur lors du chargement des statistiques par question', (data: Stat[]) => {
      this.stats = new MatTableDataSource(data);
      this.cdr.detectChanges();
      this.stats.sort = this.sort;
      this.stats.paginator = this.statPaginator;
    }));

    this.statsService.getAverageNumberOfPlayers().subscribe(this.getObserver('Erreur lors du chargement du nombre moyen de joueurs', (data: number) => {
      this.numberOfPlayers = data;
    }));
  }

  private getObserver(errorMsg: string, successFunc: (data: any) => void) {
    return {
      next: (data: any) => {
        successFunc(data);
        this.loading = this.stats.data.length == 0 ||
          this.numberOfGamePlayed == -1 ||
          this.mostPlayedDifficulty == '' ||
          this.greatAnswerPercentage == -1 ||
          this.averageDiceSize == -1 ||
          this.averageGameTime == -1 ||
          this.numberOfPlayers == -1
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        this.snackBarService.openError(errorMsg);
        this.loading = false;
        this.cdr.detectChanges();
      }
    };
  }

}
