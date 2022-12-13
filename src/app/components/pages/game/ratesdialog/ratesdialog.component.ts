import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import DialogDataRates from 'src/app/interfaces/DialogDataRates';


@Component({
  selector: 'dialog-rates',
  templateUrl: './ratesdialog.component.html'
})
export class DialogRates {
  constructor(
    public dialogRef: MatDialogRef<DialogRates>,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataRates,
  ) { }
}
