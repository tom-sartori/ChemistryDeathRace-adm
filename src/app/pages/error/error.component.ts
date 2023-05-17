import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  public errorCode: number;

  constructor(private route: ActivatedRoute) {
    this.errorCode = +this.route.snapshot.paramMap.get('code')!
  }

  ngOnInit(): void {
  }

}
