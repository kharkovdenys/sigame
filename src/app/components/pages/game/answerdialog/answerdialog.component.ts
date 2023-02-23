import DialogDataAnswer from 'src/app/interfaces/DialogDataAnswer';

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-answer',
  templateUrl: './answerdialog.component.html'
})
export class DialogAnswerComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogAnswerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataAnswer,
  ) { }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
