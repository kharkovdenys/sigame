import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import DialogDataName from "src/app/interfaces/DialogDataName";

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