import { Component, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatStepper } from '@angular/material';
import { ApiService } from '../../../../app/alpha/services';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'fulfillments-form-dialog',
  templateUrl: './fulfillments-form-dialog.component.html'
})
// tslint:disable-next-line:component-class-suffix

export class FulfillmentsFormDialogComponent {
  addressCheckComplete = false;

  order: any;
  shipTo: any;
  @ViewChild('stepper', {read: MatStepper}) stepper: MatStepper;

  consignments: Array<any> = [
      new ConsignmentGroup([new Package(1, 0.5, 12, 12, 12)])
  ];

  packages: Array<Package>;


  constructor(
    public dialogRef: MatDialogRef<FulfillmentsFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
  ) {
    this.shipTo = {
      shipTo_name: this.data.shipTo_name,
      shipTo_companyName: this.data.shipTo_companyName,
      shipTo_phone: this.data.shipTo_phone,
      shipTo_email: this.data.shipTo_email,
      shipTo_address1: this.data.shipTo_address1,
      shipTo_address2: this.data.shipTo_address2,
      shipTo_address3: this.data.shipTo_address3,
      shipTo_address4: this.data.shipTo_address4,
      shipTo_suburb: this.data.shipTo_suburb,
      shipTo_state: this.data.shipTo_state,
      shipTo_postcode: this.data.shipTo_postcode,
      shipTo_country: this.data.shipTo_country
    };
  }

  checkAddress(){
    this.apiService.get('Fulfillments', 'checkAddress', null, this.shipTo).subscribe(
      (res) => {
        this.addressCheckComplete = true;
        this.stepper.next();
      },
      (err) => {

      },
      () => {

      }
    );
  }

  closeDialog(completed: boolean) {
    if (completed === true){
      this.dialogRef.close();
    }
  }

  addTo($event: any) {
    if ($event) {
        this.packages.push($event.dragData);
    }
  }

  newConsignment(){
    this.consignments.push(new ConsignmentGroup([new Package(1, 0.5, 12, 12, 12)]));
  }

  newPackage(consignment: ConsignmentGroup){
    consignment.packages.push(new Package(1, 0.5, 12, 12, 12));
  }
}

class ConsignmentGroup {
  constructor(public packages: Array<Package>) {}
}

class Package {
  constructor(
    public qty: number,
    public weight: number,
    public length: number,
    public width: number,
    public height: number
  ) {}
}
