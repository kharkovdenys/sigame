import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import DialogDataName from 'src/app/interfaces/DialogDataName';

@Component({
  selector: 'dialog-join',
  templateUrl: './dialog.component.html'
})
export class DialogJoin {
  constructor(
    public dialogRef: MatDialogRef<DialogJoin>,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataName,
  ) { }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
