import { Consignment } from './../../../../app/alpha/models/consignment.model';
import { Component, Inject, ViewChild, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatStepper, MatSnackBar } from '@angular/material';
import { HttpClient, HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { ApiService } from '../../../../app/alpha/services';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'fulfillments-bulk-dialog',
  templateUrl: './fulfillments-bulk-dialog.component.html'
})
// tslint:disable-next-line:component-class-suffix

export class FulfillmentsBulkDialogComponent {
  addressCheckComplete = false;
  packageCheckComplete = false;
  quoteCheckComplete = false;
  processCompleted = false;
  processError = false;

  orders: any;
  shipTo: any;
  @ViewChild('stepper', {read: MatStepper}) stepper: MatStepper;
  @ViewChild('myIframe') iframe;

  consignments: Array<any> = [
      new ConsignmentGroup([new Package(1, 0.5, 12, 12, 12)])
  ];

  packages: Array<Package>;

  totalOrders = 0;
  totalReceived = 0;
  totalSuccess = 0;
  totalFailed = 0;
  consignmentsIds = [];
  orderArray: OrderArray;

  constructor(
    public dialogRef: MatDialogRef<FulfillmentsBulkDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: [any],
    private apiService: ApiService,
    public snackBar: MatSnackBar,
    private http: HttpClient,
  ) {
    this.totalOrders = this.data.length;
    this.processOrder(this.data);
  }

  processOrder(data){
    // tslint:disable-next-line:prefer-const
    let orderid: number[] = [];
    for (let i = 0; i < data.length; i++) {
      orderid.push(data[i]['id']);
    }
    this.orderArray = this.createOrderArray(orderid);
    
    this.apiService.post('Orders', 'processOrders', null, this.orderArray).subscribe(
    // this.http.post('http://app.eiz.com.au/api/auth/Orders/processOrders', this.orderArray, {}).subscribe(
        (resp: any) => {console.log(resp);
          this.processCompleted = true;
        }, 
        error => {console.log(error);
            this.processError = true;
        }
    );
  }

  createOrderArray(oids: number[]): OrderArray {
    return {
        ids      : oids
    };
  }

  // startProcess(orders){
  //   orders.forEach(order => {
  //     this.processOrder(order);
  //   });
  // }

  // processOrder(order: any){
  //   const consignments = [];
  //   const shipTo = {
  //     shipTo_name: order.shipTo_name,
  //     shipTo_companyName: order.shipTo_companyName,
  //     shipTo_phone: order.shipTo_phone,
  //     shipTo_email: order.shipTo_email,
  //     shipTo_address1: order.shipTo_address1,
  //     shipTo_address2: order.shipTo_address2,
  //     shipTo_address3: order.shipTo_address3,
  //     shipTo_address4: order.shipTo_address4,
  //     shipTo_suburb: order.shipTo_suburb,
  //     shipTo_state: order.shipTo_state,
  //     shipTo_postcode: order.shipTo_postcode,
  //     shipTo_country: order.shipTo_country
  //   };
  //   this.apiService.get('Fulfillments', 'checkAddress', null, shipTo).subscribe(
  //     (addressCheckResponse) => {
  //       if (!addressCheckResponse.message){
  //         if (order.orderlines.length === 1){
  //           if (order.orderlines[0].listing.package){
  //             order.orderlines[0].listing.package.forEach(pack => {
  //               consignments.push(
  //                 new ConsignmentGroup([new Package(pack.qty, pack.weight, pack.length, pack.width, pack.height)])
  //               );
  //             });

  //             consignments.forEach(consignment => {
  //               this.apiService.post('Fulfillments', 'quote', null,
  //                 {
  //                   'parcels': consignment.packages,
  //                   'suburb': shipTo.shipTo_suburb,
  //                   'postcode': shipTo.shipTo_postcode,
  //                   // 'postcode_id': shipTo.postcode_id
  //                 }).subscribe(
  //                 (quoteResponse) => {
  //                   consignment.quoteSelected = quoteResponse.data[0];
  //                   consignment.quotes = quoteResponse.data;
  //                   consignment.quotes.forEach(quote => {
  //                     if (consignment.quoteSelected.amount > quote.amount){
  //                       consignment.quoteSelected = quote;
  //                     }
  //                   });

  //                   this.saveFulfillment(order, consignments, shipTo).subscribe(
  //                     res_fulfillment => {
  //                       const consignmentsIds = [];
  //                       // tslint:disable-next-line:no-shadowed-variable
  //                       res_fulfillment.data.consignments.forEach(consignment => {
  //                         consignmentsIds.push(consignment.id);
  //                       });


  //                       console.log(consignment.quoteSelected);
  //                       this.totalReceived++;
  //                       this.totalSuccess++;
  //                     }
  //                   );


  //                 }
  //               );
  //             });
  //           }else{
  //             // package not set
  //             console.log('package not set');
  //             this.totalReceived++;
  //             this.totalFailed++;
  //           }
  //         }else{
  //           // multi items
  //           console.log('multi items');
  //           this.totalReceived++;
  //           this.totalFailed++;
  //         }
  //       }else{
  //         // address error
  //         console.log('Address Error');
  //         this.totalReceived++;
  //         this.totalFailed++;
  //       }
  //     }
  //   );
  // }

  // solidConsignments(print){
  //   this.apiService.post('fulfillments', 'solidConsignments', null, {'ids': this.consignmentsIds}).subscribe(
  //     res_labels => {
  //       if (res_labels['data']) {
  //         if (print){
  //           this.apiService.get('fulfillments', 'printConsignments', null, {'ids[]': this.consignmentsIds}).subscribe(
  //             res => {
  //               window.open(res.data.url);
  //             }
  //           );
  //         }
  //       }
  //     },
  //     err => {
  //       console.log(`Error in solid consignment: ${err}`);
  //     },
  //     () => {
  //       console.log('solid consignment Completed');
  //     }
  //   );
  // }

  // saveFulfillment(order, consignments, shipTo){
  //   const orderIds = [order.id];
  //   const consignemntData = [];
  //   consignments.forEach(consignment => {
  //     consignemntData.push({
  //       'shipTo_name': shipTo.shipTo_name,
  //       'shipTo_companyName': shipTo.shipTo_companyName,
  //       'shipTo_phone': shipTo.shipTo_phone,
  //       'shipTo_email': shipTo.shipTo_email,
  //       'shipTo_address1': shipTo.shipTo_address1,
  //       'shipTo_address2': shipTo.shipTo_address2,
  //       'shipTo_address3': shipTo.shipTo_address3,
  //       'shipTo_address4': shipTo.shipTo_address4,
  //       'shipTo_suburb': shipTo.shipTo_suburb,
  //       'shipTo_state': shipTo.shipTo_state,
  //       'shipTo_postcode': shipTo.shipTo_postcode,
  //       'shipTo_country': shipTo.shipTo_country,
  //       'shipTo_instruction1': shipTo.shipTo_instruction1,
  //       'shipTo_instruction2': shipTo.shipTo_instruction2,
  //       'data': consignment.packages,
  //       'shippingMethod_id': consignment.quoteSelected.shippingMethod.id,
  //     });
  //   });
  //   const data = {
  //     'shipTo_ref': '1234',
  //     'shipTo_name': shipTo.shipTo_name,
  //     'shipTo_companyName': shipTo.shipTo_companyName,
  //     'shipTo_phone': shipTo.shipTo_phone,
  //     'shipTo_email': shipTo.shipTo_email,
  //     'shipTo_address1': shipTo.shipTo_address1,
  //     'shipTo_address2': shipTo.shipTo_address2,
  //     'shipTo_address3': shipTo.shipTo_address3,
  //     'shipTo_address4': shipTo.shipTo_address4,
  //     'shipTo_suburb': shipTo.shipTo_suburb,
  //     'shipTo_state': shipTo.shipTo_state,
  //     'shipTo_postcode': shipTo.shipTo_postcode,
  //     'shipTo_country': shipTo.shipTo_country,
  //     'shipTo_instruction1': shipTo.shipTo_instruction1,
  //     'shipTo_instruction2': shipTo.shipTo_instruction2,
  //     'orderIds': orderIds,
  //     'consignments': consignemntData,
  //   };
  //   return this.apiService.post('fulfillments', 'fulfillments', null, data);
  // }
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

export interface OrderArray {
  ids: number[];
}
