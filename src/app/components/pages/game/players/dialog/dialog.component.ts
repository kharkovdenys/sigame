import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import DialogDataScore from 'src/app/interfaces/DialogDataScore';

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
