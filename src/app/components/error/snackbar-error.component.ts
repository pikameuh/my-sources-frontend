import {Component} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

/**
 * @title Basic snack-bar
 */
@Component({
  selector: 'snackbar-error',
  templateUrl: './snackbar-error.component.html',
  styleUrls: ['./snackbar-error.component.scss'],
})
export class SnackBarErrorComponent {
 

  durationInSeconds = 5;

  constructor(private _snackBar: MatSnackBar) {}

  openSnackBar(message: string, action: string, className: string) {
    this._snackBar.open(message, action, {
      duration: this.durationInSeconds * 1000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: [className],
    });
  }

  openClientErrorSnackBar(msg: string) {
    this.openSnackBar(msg, 'Ok', 'blue-snackbar');
  }

  openOKErrorSnackBar(msg: string) {
    this.openSnackBar(msg, 'Ok', 'green-snackbar');
  }
}