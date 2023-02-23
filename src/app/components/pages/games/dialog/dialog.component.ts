import DialogDataName from 'src/app/interfaces/DialogDataName';

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

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
