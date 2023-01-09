import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import DialogDataName from 'src/app/interfaces/DialogDataName';

@Component({
  selector: 'app-dialog-join',
  templateUrl: './dialog.component.html'
})
export class DialogJoinComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogJoinComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataName,
  ) { }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
