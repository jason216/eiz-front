import { Component, Input, Output, OnInit, OnDestroy, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { TableColumn, ColumnMode } from '@swimlane/ngx-datatable';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'fulfillments-new',
  templateUrl: './fulfillments-new.component.html',
  styleUrls: ['./fulfillments-new.component.scss']
})
export class FulfillmentsNewComponent implements OnInit, OnDestroy {

  constructor() {
  }
  ngOnInit() {
    // this.rows.push(JSON.parse(this.orderline));
    // this.columnsRef = [
    //   { prop: 'itemnumber', name: 'Product Code', editable: true, maxWidth: 150, cellTemplate: this.cellEditTextTmpl },
    //   { prop: 'itemtitle', name: 'Name', editable: true, cellTemplate: this.cellEditTextTmpl },
    //   { prop: 'quantity', name: 'Qty', editable: true, maxWidth: 50, cellTemplate: this.cellEditTextTmpl },
    //   { prop: 'saleprice', name: 'Unit Price', editable: true, maxWidth: 50, cellTemplate: this.cellEditTextTmpl },
    //   { name: 'Actions', maxWidth: 300, cellTemplate: this.cellActionTmpl },
    // ];
  }

  ngOnDestroy() {
    // this.startSubscribe = false;
  }
}
