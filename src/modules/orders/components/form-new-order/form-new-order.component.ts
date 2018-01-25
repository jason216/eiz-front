import { Component, Input, Output, OnInit, OnDestroy, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { TableColumn, ColumnMode } from '@swimlane/ngx-datatable';
import { OrderService } from '../../../../app/alpha/services';


@Component({
  selector: 'form-new-order',
  templateUrl: './form-new-order.component.html',
})
export class FormNewOrderComponent implements OnInit, OnDestroy{

  options: FormGroup;
  @ViewChild('cellActionTmpl') cellActionTmpl: TemplateRef<any>;
  @ViewChild('cellEditTextTmpl') cellEditTextTmpl: TemplateRef<any>;

  statusControl = new FormControl();

  statusGroups = [
    {
      name: 'active',
      status: [
        { value: 'pending', viewValue: 'Pending' },
        { value: 'processing', viewValue: 'Processing' }
      ]
    },
    {
      name: 'completed',
      status: [
        { value: 'shipped', viewValue: 'Shipped' },
        { value: 'cancelled', viewValue: 'Cancelled' },
        { value: 'refunded', viewValue: 'Refunded' }
      ]
    },
    {
      name: 'issue',
      disabled: false,
      status: [
        { value: 'backorder', viewValue: 'Backorder' },
        { value: 'issue', viewValue: 'Issue' },
        { value: 'unpaid', viewValue: 'Unpaid' }
      ]
    }
  ];

  payments = [
    { value: 'cash', viewValue: 'Cash'},
    { value: 'creditCard', viewValue: 'Credit Card' },
    { value: 'debitCard', viewValue: 'Debit Card' },
    { value: 'bankDeposit', viewValue: 'Bank Deposit' },
    { value: 'paypal', viewValue: 'Paypal' }
  ];

  rows: any[] = [];
  orderline = '{ "itemnumber": 0, "itemtitle": 0, "quantity": 0, "saleprice": 0}';
  editing = {};
  columnsRef = [];

  order = {
    salesRecordNumber: '',
    status: '',
    postage: '',
    // postageService: '',
    // note: '',
    shipTo_name: '',
    // shipTo_companyName: '',
    shipTo_phone: '',
    shipTo_email: '',
    shipTo_address1: '',
    shipTo_address2: '',
    shipTo_suburb: '',
    shipTo_postcode: '',
    shipTo_state: '',
    shipTo_country: '',
    // userId: '',
    // name: '',
    // email: '',
    // phone: '',
    payments: [
      // { paymentMethod: '', type: '', subject: '', amount: '', reference: '' }
    ],
    orderlines: []
  }

  constructor(private orderService: OrderService) {
  }

  ngOnInit() {
    this.rows.push(JSON.parse(this.orderline));
    this.columnsRef = [
      { prop: 'itemnumber', name: 'Product Code', editable: true, maxWidth: 150, cellTemplate: this.cellEditTextTmpl },
      { prop: 'itemtitle', name: 'Name', editable: true, cellTemplate: this.cellEditTextTmpl },
      { prop: 'quantity', name: 'Qty', editable: true, maxWidth: 50, cellTemplate: this.cellEditTextTmpl },
      { prop: 'saleprice', name: 'Unit Price', editable: true, maxWidth: 50, cellTemplate: this.cellEditTextTmpl },
      { name: 'Actions', maxWidth: 300, cellTemplate: this.cellActionTmpl},
    ];
  }

  ngOnDestroy() {
   // this.startSubscribe = false;
  }

  submit(){
    this.order['orderlines'] = this.rows;
    this.orderService.newOrder(this.order);
    console.log('order is', this.order);
  }

  //Orderline table
  updateValue(event, cell, rowIndex) {
    //console.log(event);
    //console.log('inline editing rowIndex', rowIndex);

    var val = event instanceof Date ? event : event.target.value;

    this.rows[rowIndex][cell] = val;
    this.rows = [...this.rows];
    //console.log('UPDATED!', this.rows[rowIndex][cell]);
  }
  addRow() {
      let rows = [...this.rows];
      rows.push(JSON.parse(this.orderline));
      this.rows = [...rows];
    const tmp: HTMLInputElement = document.createElement('input');
    document.body.appendChild(tmp);
    tmp.focus();
    tmp.blur();
    document.body.removeChild(tmp);
  }

  deleteRow(row, rowIndex) {
    //console.log('delete index', rowIndex);
    let rows = [...this.rows];
    rows.splice(rowIndex, 1);
    this.rows = [...rows];
  }

}
