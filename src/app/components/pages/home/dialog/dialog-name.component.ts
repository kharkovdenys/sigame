import DialogDataName from 'src/app/interfaces/DialogDataName';

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-dialog-name',
    templateUrl: 'dialog-name.component.html',
})
export class DialogNameComponent {
    constructor(
        public dialogRef: MatDialogRef<DialogNameComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogDataName,
    ) { }

    onCancelClick(): void {
        this.dialogRef.close();
    }
}