import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import DialogDataRates from 'src/app/interfaces/DialogDataRates';


@Component({
  selector: 'app-dialog-rates',
  templateUrl: './ratesdialog.component.html'
})
export class DialogRatesComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogRatesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataRates,
  ) { }
}
