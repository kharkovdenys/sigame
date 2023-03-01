import DialogDataRates from 'src/app/interfaces/DialogDataRates';

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

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
