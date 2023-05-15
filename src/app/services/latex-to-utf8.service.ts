import { Injectable } from '@angular/core';

declare var latex2utf8: any;

@Injectable({
  providedIn: 'root'
})
export class LatexToUtf8Service {

  constructor() { }

  public convert(latex: string): string {
    return latex2utf8(latex);
  }
}
