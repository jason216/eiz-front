import { Component, Inject, ViewChild, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatStepper, MatSnackBar } from '@angular/material';
import {MatRadioModule} from '@angular/material/radio';
import {FormsModule} from '@angular/forms';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'fulfillments-selectAddress-dialog',
  templateUrl: './fulfillments-selectAddress-dialog.component.html'
})
// tslint:disable-next-line:component-class-suffix

export class FulfillmentsSelectAddressDialogComponent {
  addresses;
  selected;

  lat = -34.397;
  lng = 150.644;

  constructor(
    public dialogRef: MatDialogRef<FulfillmentsSelectAddressDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: [any],
  ) {
    this.addresses = data;
  }

  onChange(address){
    this.selected = address;
    console.log(this.selected);
  }
}
