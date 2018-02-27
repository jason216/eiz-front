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
  packageCheckComplete = false;
  // tslint:disable-next-line:no-inferrable-types
  quoteCheckComplete: boolean = false;

  order: any;
  shipTo: any;
  @ViewChild('stepper', {read: MatStepper}) stepper: MatStepper;

  consignments: Array<any> = [
      new ConsignmentGroup([new Package(1, 0.5, 12, 12, 12)])
  ];

  packages: Array<Package>;


  constructor(
    public dialogRef: MatDialogRef<FulfillmentsFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: [any],
    private apiService: ApiService,
  ) {
    if (this.data.length === 1){
      this.shipTo = {
        shipTo_name: this.data[0].shipTo_name,
        shipTo_companyName: this.data[0].shipTo_companyName,
        shipTo_phone: this.data[0].shipTo_phone,
        shipTo_email: this.data[0].shipTo_email,
        shipTo_address1: this.data[0].shipTo_address1,
        shipTo_address2: this.data[0].shipTo_address2,
        shipTo_address3: this.data[0].shipTo_address3,
        shipTo_address4: this.data[0].shipTo_address4,
        shipTo_suburb: this.data[0].shipTo_suburb,
        shipTo_state: this.data[0].shipTo_state,
        shipTo_postcode: this.data[0].shipTo_postcode,
        shipTo_country: this.data[0].shipTo_country
      };
    }

    console.log(data);
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

  checkPackage(){
    this.packageCheckComplete = true;
    this.stepper.next();
    this.consignments.forEach(consignment => {
      // tslint:disable-next-line:max-line-length
      this.apiService.post('Fulfillments', 'quote', null, {'parcels': consignment.packages, 'suburb': this.shipTo.shipTo_suburb, 'postcode': this.shipTo.shipTo_postcode, 'postcode_id': this.shipTo.postcode_id}).subscribe(
        (res) => {
          consignment.quoteSelected = res.data[0];
          consignment.quotes = res.data;
          consignment.quotes.forEach(quote => {
            if (consignment.quoteSelected.amount > quote.amount){
              consignment.quoteSelected = quote;
            }
          });
          this.quoteCheckComplete = this.checkQuoteComplete();
        }
      );
    });
  }

  checkQuoteComplete(){
    let status = true;
    this.consignments.forEach(consignment => {
      status = status && consignment.hasOwnProperty('quoteSelected');
    });
    return status;
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

  saveFulfillment(createLabels){
    const data = {
      'shipTo_ref': '1234',
      'shipTo_name': this.shipTo.shipTo_name,
      'shipTo_companyName': this.shipTo.shipTo_companyName,
      'shipTo_phone': this.shipTo.shipTo_phone,
      'shipTo_email': this.shipTo.shipTo_email,
      'shipTo_address1': this.shipTo.shipTo_address1,
      'shipTo_address2': this.shipTo.shipTo_address2,
      'shipTo_address3': this.shipTo.shipTo_address3,
      'shipTo_address4': this.shipTo.shipTo_address4,
      'shipTo_suburb': this.shipTo.shipTo_suburb,
      'shipTo_state': this.shipTo.shipTo_state,
      'shipTo_postcode': this.shipTo.shipTo_postcode,
      'shipTo_country': this.shipTo.shipTo_country,
      'shipTo_instruction1': this.shipTo.shipTo_instruction1,
      'shipTo_instruction2': this.shipTo.shipTo_instruction2,
      'orderIds': [1],
    };
    this.apiService.post('fulfillments', 'fulfillments', null, null);
    this.apiService.post('fulfillments', 'solidConsignments', null).subscribe(
      res => {
        if (res['data']) {
          console.log('solid consignment return ', res['data']);
        }
      },
      err => {
        console.log(`Error in solid consignment: ${err}`);
      },
      () => {
        console.log('solid consignment Completed');
      }
    );
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
