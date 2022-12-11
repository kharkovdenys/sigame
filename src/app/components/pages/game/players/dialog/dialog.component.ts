import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import DialogDataScore from 'src/app/interfaces/DialogDataScore';

@Component({
  selector: 'dialog-score',
  templateUrl: './dialog.component.html'
})
export class DialogScore {
  constructor(
    public dialogRef: MatDialogRef<DialogScore>,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataScore,
  ) { }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  isInteger(number: number): boolean { return Number.isInteger(number) }
}
