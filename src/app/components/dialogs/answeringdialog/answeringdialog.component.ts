import DialogDataAnswer from 'src/app/interfaces/DialogDataAnswer';

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-answering',
  templateUrl: './answeringdialog.component.html'
})
export class DialogAnsweringComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogAnsweringComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataAnswer,
  ) { }
}
