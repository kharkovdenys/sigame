import DialogFinalDataAnswer from 'src/app/interfaces/DialogFinalDataAnswer';

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-final-dialog-answer',
  templateUrl: './finalanswerdialog.component.html'
})
export class DialogFinalAnswerComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogFinalAnswerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogFinalDataAnswer,
  ) { }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
