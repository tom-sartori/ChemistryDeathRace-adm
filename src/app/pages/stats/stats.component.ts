import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { StatsService } from '../../services/stats.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Stat } from '../../models/stat.model';

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

  constructor(private statsService: StatsService) {

    this.numberOfGamePlayed = 0;
    this.mostPlayedDifficulty = '';
    this.greatAnswerPercentage = 0;
    this.averageDiceSize = 0;
    this.averageGameTime = 0;
    this.numberOfPlayers = 0;
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
    this.statsService.getGamesPlayed().subscribe((data) => {
      this.numberOfGamePlayed = data;
    });
    this.statsService.getMostPlayedDifficulty().subscribe((data) => {
      this.mostPlayedDifficulty = data
    });
    this.statsService.getGreatAnswerPercentage().subscribe((data) => {
      this.greatAnswerPercentage = data;
    });
    this.statsService.getAverageDiceSize().subscribe((data) => {
      this.averageDiceSize = data;
    });
    this.statsService.getAverageGameTime().subscribe((data) => {
      this.averageGameTime = data / 1000 / 60;
    });
    this.statsService.getStatsByQuestion().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
    this.statsService.getAverageNumberOfPlayers().subscribe((data) => {
      this.numberOfPlayers = data;
    });
  }
}
