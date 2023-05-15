import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-stat-tile',
  templateUrl: './stat-tile.component.html',
  styleUrls: ['./stat-tile.component.scss']
})
export class StatTileComponent implements OnInit {

  @Input() header!: string;
  @Input() value!: string | number;
  @Input() footer!: string;

  constructor() {
  }

  ngOnInit(): void {
  }

}
