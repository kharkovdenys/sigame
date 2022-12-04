import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import DialogDataName from "src/app/interfaces/DialogDataName";

@Component({
    selector: 'dialog-name',
    templateUrl: 'dialog-name.component.html',
})
export class DialogName {
    constructor(
        public dialogRef: MatDialogRef<DialogName>,
        @Inject(MAT_DIALOG_DATA) public data: DialogDataName,
    ) { }

    onCancelClick(): void {
        this.dialogRef.close();
    }
}