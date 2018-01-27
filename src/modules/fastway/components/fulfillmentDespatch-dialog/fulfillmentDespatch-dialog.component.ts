import { Component, Inject, ViewChild, EventEmitter} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatInput } from '@angular/material';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'fulfillmentsDespatch-dialog',
  templateUrl: './fulfillmentsDespatch-dialog.component.html',
})
export class FulfillmentsDespatchDialogComponent {
  @ViewChild('trackingNumber', {read: MatInput}) trackingNumber: MatInput;

  constructor(
    public dialogRef: MatDialogRef<FulfillmentsDespatchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public consignment_id: any
  ) {
    console.log('consignment_id is ', this.consignment_id);

  }

  closeDialog(event) {
    this.dialogRef.close(event);
  }

  despatchSuccess(){
  }
}
