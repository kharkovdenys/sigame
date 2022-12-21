import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import DialogDataAnswer from 'src/app/interfaces/DialogDataAnswer';


@Component({
  selector: 'dialog-answer',
  templateUrl: './answerdialog.component.html'
})
export class DialogAnswer {
  constructor(
    public dialogRef: MatDialogRef<DialogAnswer>,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataAnswer,
  ) { }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
