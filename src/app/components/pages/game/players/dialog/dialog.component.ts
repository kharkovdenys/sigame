import DialogDataScore from 'src/app/interfaces/DialogDataScore';

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-score',
  templateUrl: './dialog.component.html'
})
export class DialogScoreComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogScoreComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataScore,
  ) { }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  isInteger(number: number): boolean { return Number.isInteger(number) }
}
