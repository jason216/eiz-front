import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: "fulfillments-form-dialog",
  templateUrl: "./fulfillments-form-dialog.component.html"
})
export class FulfillmentsFormDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<FulfillmentsFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log("order is ", this.data);

  }

  closeDialog(completed: boolean) {
    if (completed === true){
      this.dialogRef.close();
    }
  }
}
