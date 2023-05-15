import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  constructor(
    public snackBar: MatSnackBar
  ) {
  }

  private open(message: string, action: string, config: any): MatSnackBarRef<TextOnlySnackBar> {
    return this.snackBar.open(message, action, config);
  }

  public openSuccess(message: string): MatSnackBarRef<TextOnlySnackBar> {
    return this.open(message, '×', {
      panelClass: 'success',
      verticalPosition: 'top',
      duration: 3000
    });
  }

  public openError(message: string): MatSnackBarRef<TextOnlySnackBar> {
    return this.open(message, '×', {
      panelClass: 'error',
      verticalPosition: 'top',
      duration: 3000
    });
  }
}
