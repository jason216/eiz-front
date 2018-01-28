import { FulfillmentsService } from './../../../../app/alpha/services/fulfillments.service';
import { Consignment } from './../../../../app/alpha/models/consignment.model';
import {
  Component,
  Input,
  Output,
  OnInit,
  OnDestroy,
  ViewChild,
  TemplateRef,
  ElementRef,
  EventEmitter
} from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { TableColumn, ColumnMode } from '@swimlane/ngx-datatable';
import { ConsignmentsService } from '../../../../app/alpha/services/index';
import { Receiver } from './../../../../app/alpha/models/Receiver.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'fulfillments-form',
  templateUrl: './fulfillments-form.component.html',
  styleUrls: ['./fulfillments-form.component.scss']
})
export class FulfillmentsFormComponent implements OnInit, OnDestroy {
  @Input() order: any;
  @Output() onCreated = new EventEmitter<boolean>();

  @Output() onCompleted = new EventEmitter<boolean>();

  parcels = [];
  parcelIndex = 1;
  consignments: Consignment[] = [];

  totalCost = 0;
  defaultConsignment = {
    shippingMethod_id: '1',
    shipTo_ref: '1',
    shipTo_name: '1',
    shipTo_companyName: '1',
    shipTo_phone: '1',
    shipTo_email: '1',
    shipTo_address1: '1',
    shipTo_suburb: '1',
    shipTo_state: '1',
    shipTo_postcode: '1',
    shipTo_country: '1',
    shipTo_instruction1: '1',
    data: [{ qty: 0, length: 0, width: 0, height: 0 }]
  };

  constructor(private consignmentsService: ConsignmentsService, private fulfillmentsService: FulfillmentsService) {
    this.parcels = [];

    this.parcelIndex = 1;
    this.parcels.push({ id: this.parcelIndex });

    this.consignments = [];
    this.consignments = this.consignmentsService.allConsignments;

    this.consignmentsService.getConsignmentTotalCost().subscribe( data => {
      this.totalCost = data;
    });
    this.consignmentsService
      .getConsignment(this.parcelIndex)
      .subscribe(data => {
        if (!this.consignments.find(item => item.id === this.parcelIndex)) {
          this.consignments.push(data);
        }
      });
  }

  ngOnInit() {}

  ngOnDestroy() {
    // this.startSubscribe = false;
  }

  newParcelTab() {
    this.parcelIndex = this.parcelIndex + 1;
    this.parcels.push({ id: this.parcelIndex });
    this.consignmentsService
      .getConsignment(this.parcelIndex)
      .subscribe(data => {
        if (!this.consignments.find(item => item.id === this.parcelIndex)) {
          this.consignments.push(data);
        }
      });
  }

  saveFulfillment() {
    const data = this.transOrder(this.order);
    const list = this.transConsignments();
    data['consignments'] = list;
    console.log('final result', data);

    this.fulfillmentsService.newFulfillment(data);
    this.onCompleted.emit(true);
    this.consignmentsService.deleteConsignments();
  }
  cancelFulfillment() {
    this.onCompleted.emit(true);
    this.consignmentsService.deleteConsignments();
  }

  updateConsignments(flag) {
    if (flag = true){
      this.consignments = this.consignmentsService.allConsignments;
      this.consignmentsService
        .getConsignments()
        .subscribe(data => {
          this.consignments = data;
        });
      this.consignmentsService.getConsignmentTotalCost().subscribe(data => {
        this.totalCost = data;
      });
    }
  }

  transConsignments(){
    const newConsignments = [];
    for (const consignment of this.consignments){
      newConsignments.push(consignment.transToJson(this.order));
    }
    return newConsignments;
  }

  transOrder(params: any) {
    return {
      orderIds: [params['id']],
      shipTo_ref: params['shipTo_ref'],
      shipTo_companyName: this.order['shipTo_companyName'],
      shipTo_phone : params['shipTo_phone'],
      shipTo_email : params['shipTo_email'],
      shipTo_address1 : params['shipTo_address1'],
      shipTo_suburb : params['shipTo_suburb'],
      shipTo_state : params['shipTo_state'],
      shipTo_postcode : params['shipTo_postcode'],
      shipTo_country : params['shipTo_country'],
      shipTo_instruction1 : params['shipTo_instruction1']
    };
  }
}
