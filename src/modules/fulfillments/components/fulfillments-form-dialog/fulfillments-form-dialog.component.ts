import { Consignment } from './../../../../app/alpha/models/consignment.model';
import { Component, Inject, ViewChild, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatStepper, MatSnackBar } from '@angular/material';
import { ApiService } from '../../../../app/alpha/services';
import { DomSanitizer } from '@angular/platform-browser';

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

  solidConsignments: any;

  orders: any;
  shipTo: any;
  @ViewChild('stepper', {read: MatStepper}) stepper: MatStepper;
  @ViewChild('myIframe') iframe;

  consignments: Array<any> = [
      new ConsignmentGroup([new Package(1, 0.5, 12, 12, 12)])
  ];

  packages: Array<Package>;


  constructor(
    public dialogRef: MatDialogRef<FulfillmentsFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: [any],
    private apiService: ApiService,
    public sanitizer: DomSanitizer,
    public snackBar: MatSnackBar,
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
    if (this.data.length === 1 && this.data[0].orderlines.length === 1 && this.data[0].orderlines[0].listing && this.data[0].orderlines[0].listing.package){
      const packages = this.data[0].orderlines[0].listing.package;
      this.consignments = [];
      packages.forEach(pack => {
        this.consignments.push(
          new ConsignmentGroup([new Package(pack.qty, pack.weight, pack.length, pack.width, pack.height)])
        );
      });

    }
    this.orders = this.data;
  }

  checkAddress(){
    this.apiService.get('Fulfillments', 'checkAddress', null, this.shipTo).subscribe(
      (res) => {
        if (res.message){
          this.snackBar.open(res.message, 'Got it', {
            duration: 2000,
          });
        }else{
          this.stepper.selected.completed = true;
          this.stepper.next();
        }
      },
      (err) => {
        console.log(err);
      },
      () => {

      }
    );
  }

  checkPackage(){
    this.stepper.selected.completed = true;
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
            // console.log(consignment.quoteSelected);
          });

          this.quoteCheckComplete = this.checkQuoteComplete();
        }
      );
    });
  }

  removePackage(consignment, item: Package){
    const index = consignment.packages.indexOf(item);
    consignment.packages.splice(index, 1);
    if (consignment.packages.length === 0){
      this.consignments.splice(this.consignments.indexOf(consignment), 1);
    }
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

  pdfLoad(){
    // this.iframe.nativeElement.src = 'https://s3.ap-southeast-2.amazonaws.com/eiz.labels/labels/2018/02/27/5a9541baab4c8.pdf';
    // this.iframe.nativeElement.onload = this.printIframe();
    // console.log(this.iframe);
    window.open('https://s3.ap-southeast-2.amazonaws.com/eiz.labels/labels/2018/02/27/5a9541baab4c8.pdf');

    // return this.sanitizer.bypassSecurityTrustUrl('https://s3.ap-southeast-2.amazonaws.com/eiz.labels/labels/2018/02/27/5a9541baab4c8.pdf');
  }

  printIframe(){
    // this.iframe.nativeElement.contentWindow.print();
  }

  saveFulfillment(createLabels){
    const orderIds = [];
    this.orders.forEach(order => {
      orderIds.push(order.id);
    });
    const consignemntData = [];
    this.consignments.forEach(consignment => {
      consignemntData.push({
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
        'data': consignment.packages,
        'shippingMethod_id': consignment.quoteSelected.shippingMethod.id,
      });
    });
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
      'orderIds': orderIds,
      'consignments': consignemntData,
    };
    this.apiService.post('fulfillments', 'fulfillments', null, data).subscribe(
      res_fulfillment => {
        const consignmentsIds = [];
        res_fulfillment.data.consignments.forEach(consignment => {
          consignmentsIds.push(consignment.id);
        });

        if (createLabels){
          this.apiService.post('fulfillments', 'solidConsignments', null, {'ids': consignmentsIds}).subscribe(
            res_labels => {
              console.log(res_labels);
              if (res_labels['data']) {
                this.solidConsignments = res_labels['data'];
                console.log(this.solidConsignments);
                this.apiService.get('fulfillments', 'printConsignments', null, {'ids[]': consignmentsIds}).subscribe(
                  res => {
                    window.open(res.data.url);
                  }
                );
              }
            },
            err => {
              console.log(`Error in solid consignment: ${err}`);
            },
            () => {
              console.log('solid consignment Completed');
            }
          );
        }else{
          this.dialogRef.close();
        }
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
