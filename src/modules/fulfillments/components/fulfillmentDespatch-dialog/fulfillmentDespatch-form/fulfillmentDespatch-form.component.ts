import { Component, Input, Output, OnInit, OnDestroy, ViewChild, TemplateRef, ElementRef, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { TableColumn, ColumnMode } from '@swimlane/ngx-datatable';
import { MatInput } from '@angular/material';
import { ApiService} from '../../../../../app/alpha/services/api.service';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'fulfillmentDespatch-form',
  templateUrl: './fulfillmentDespatch-form.component.html',
  styleUrls: ['./fulfillmentDespatch-form.component.scss']
})
export class FulfillmentDespatchFormComponent implements OnInit, OnDestroy {
  @ViewChild('trackingNumber', {read: MatInput}) trackingNumber: MatInput;
  @Input() consignment_id: any;
  @Output() onDespatched = new EventEmitter<object>();

  consignment: object;

  constructor(
    public apiService: ApiService,
  ) {}
  ngOnInit() {
    this.apiService.get('Fulfillments', 'consignments').subscribe(
      res => {
        this.consignment = res.data;
        console.log(this.consignment);
      }
    );
    console.log(this.consignment_id);
  }

  ngOnDestroy() {
    // this.startSubscribe = false;
  }

  despatch(){
    this.apiService.post('Orders', 'getOrders').subscribe(
      res => {
        this.onDespatched.emit({
          'trackingNumber' : this.trackingNumber.value,
          'success': true,
        });
      },
      Error => {
        this.onDespatched.emit({
          'trackingNumber' : this.trackingNumber.value,
          'despatchSuccess': false,
        });
      }
    );
  }
}
