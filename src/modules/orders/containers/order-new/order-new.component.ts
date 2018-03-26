import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileUtil } from './orderupload.util';
import { Constants } from './orderupload.constants';

import {MatTableDataSource, MatStepper} from '@angular/material';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { fuseAnimations } from '../../../../app/core/animations';
import { ApiService } from '../../../../app/alpha/services';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'page-order-new',
  templateUrl: './order-new.component.html',
  styleUrls: ['./order-new.component.scss'],
  animations: fuseAnimations
})

export class OrderNewComponent implements OnInit, OnDestroy {
  private startSubscribe = true;

  // --------------
  verticalStepperStep1: FormGroup;
  verticalStepperStep2: FormGroup;
  verticalStepperStep1Errors: any;
  verticalStepperStep2Errors: any;
  template: string;

  // PAYPAL_TEMPLATE = ['Name', 'From email address', 'Transaction ID', 'Item Title', 'Item ID', 'Quantity', 
  // 'Address line 1', 'Address Line 2/District/Neighbourhood', 'Suburb', 'State/Territory/Province/Region/County/Prefecture/Republic', 
  // 'Postcode', 'Country'];

  PAYPAL_TEMPLATE = [
    {col: 'Invoice Number', matchTo: 'salesRecordNumber', parent: null},
    {col: 'Name', matchTo: 'shipTo_name', parent: null},
    {col: 'From email address', matchTo: 'shipTo_email', parent: null},
    {col: 'Address line 1', matchTo: 'shipTo_address1', parent: null},
    {col: 'Address Line 2/District/Neighbourhood', matchTo: 'shipTo_address2', parent: null},
    {col: 'Suburb', matchTo: 'shipTo_suburb', parent: null},
    {col: 'State/Territory/Province/Region/County/Prefecture/Republic', matchTo: 'shipTo_state', parent: null},
    {col: 'Postcode', matchTo: 'shipTo_postcode', parent: null},
    {col: 'Country', matchTo: 'shipTo_country', parent: null},
    {col: 'Transaction ID', matchTo: 'transactionId', parent: 'orderlines'},
    {col: 'Item Title', matchTo: 'itemtitle', parent: 'orderlines'},
    {col: 'Item ID', matchTo: 'itemnumber', parent: 'orderlines'},
    {col: 'Quantity', matchTo: 'quantity', parent: 'orderlines'},
    {col: 'Gross', matchTo: 'amount', parent: 'payments'}
  ];

  selectTemplate = false;
  selectFile = false;
  @ViewChild('stepper', {read: MatStepper}) stepper: MatStepper;
  // --------------

  ORDERCOLUMN_DATA = [
    {col: 'salesRecordNumber', label: 'Sales record number', selected: true, matchTo: null},
    // {col: 'status', label: 'Order status', selected: false},
    {col: 'postage', label: 'Postage', selected: true, matchTo: null},
    // {col: 'postageService', label: 'Postage Service', selected: true},
    // {col: 'note', label: 'Note', selected: true},
    // {col: 'created_at', label: 'Order created data', selected: true},
    // {col: 'updated_at', label: 'Order updated data', selected: true},
    {col: 'shipTo_name', label: 'Consignee name', selected: true, matchTo: null},
    {col: 'shipTo_companyName', label: 'Consignee company name', selected: true, matchTo: null},
    {col: 'shipTo_phone', label: 'Consignee phone', selected: true, matchTo: null},
    {col: 'shipTo_email', label: 'Consignee email', selected: true, matchTo: null},
    {col: 'shipTo_address1', label: 'Delivery address1', selected: true, matchTo: null},
    // {col: 'shipTo_address2', label: 'Delivery address2', selected: true},
    {col: 'shipTo_suburb', label: 'Delivery address suburb', selected: true, matchTo: null},
    {col: 'shipTo_postcode', label: 'Delivery address postcode', selected: true, matchTo: null},
    {col: 'shipTo_state', label: 'Delivery address state', selected: true, matchTo: null},
    // {col: 'shipTo_country', label: 'Delivery address country', selected: true},
    {col: 'userId', label: 'Customer ID', selected: true, matchTo: null},
    {col: 'name', label: 'Customer name', selected: true, matchTo: null},
    // {col: 'email', label: 'Customer email', selected: true},
    // {col: 'phone', label: 'Customer phone', selected: true},
    {col: 'payments', label: 'Payment', selected: true, matchTo: null},
    // {col: 'tags', label: 'Tag', selected: false},
    {col: 'orderlines', label: 'Order Line', selected: true, matchTo: null}
  ];

  orderColDuplicateError = false;

  displayedColumns = ['orderCol', 'customerOrderCol'];
  dataSource: MatTableDataSource<OrderCol>;
  uploadRecords = [];
  selectedColData = [];

  @ViewChild('fileImportInput')
  fileImportInput: any;

  csvRecords = [];
  // tslint:disable-next-line:prefer-const
  customerOrderCol: CustomerOrderCol[] = [];

  constructor(private _router: Router,
    private _fileUtil: FileUtil,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private apiService: ApiService
  ){
    this.verticalStepperStep1Errors = {
      template: {}
    };

    this.verticalStepperStep2Errors = {
        importOrder: {}
    };
  }
  ngOnInit() {
    this.verticalStepperStep1 = this.formBuilder.group({
      template: ['', Validators.required]
    });

    this.verticalStepperStep2 = this.formBuilder.group({
      importOrder: ['', Validators.required]
    });
  }

  ngOnDestroy() {
    this.startSubscribe = false;
  }

  // METHOD CALLED WHEN CSV FILE IS IMPORTED
  fileChangeListener($event): void {

    const text = [];
    const target = $event.target || $event.srcElement;
    const files = target.files; 

    if (Constants.validateHeaderAndRecordLengthFlag){
      if (!this._fileUtil.isCSVFile(files[0])){
        alert('Please import valid .csv file.');
        this.fileReset();
      }
    }

    const input = $event.target;
    const reader = new FileReader();
    // tslint:disable-next-line:label-position
    reader.readAsText(input.files[0]);

    reader.onload = (data) => {
      // tslint:disable-next-line:prefer-const
      let csvData = reader.result;
      // tslint:disable-next-line:prefer-const
      let headersRow: any;

      const csvRecordsArray = csvData.split(/\r\n|\n/);

      // tslint:disable-next-line:prefer-const
      let headerLength = -1;
      if (Constants.isHeaderPresentFlag){
        headersRow = this._fileUtil.getHeaderArray(csvRecordsArray, Constants.tokenDelimeter);

        if (this.template === 'paypal') { // paypal template is used
          for ( let i = 0; i < headersRow.length; i++ ) {
            for (let j = 0; j < this.PAYPAL_TEMPLATE.length; j++) {
              if (headersRow[i] === this.PAYPAL_TEMPLATE[j].col) {
                if (this.PAYPAL_TEMPLATE[j].parent) {
                  this.customerOrderCol.push(this.createCustomerOrderCol(headersRow[i], this.PAYPAL_TEMPLATE[j].matchTo, this.PAYPAL_TEMPLATE[j].parent, i));
                } else {
                  this.customerOrderCol.push(this.createCustomerOrderCol(headersRow[i], this.PAYPAL_TEMPLATE[j].matchTo, null, i));
                }
              }
            }
          }
          headerLength = headersRow.length; 
        } else { // template is not used
          
          for ( let i = 0; i < headersRow.length; i++ )
          {
            this.customerOrderCol.push(this.createCustomerOrderCol(headersRow[i], null, null, null));
          }
          
          this.dataSource = new MatTableDataSource(this.ORDERCOLUMN_DATA);
          headerLength = headersRow.length; 
        }
      }

      this.csvRecords = this._fileUtil.getDataRecordsArrayFromCSVFile(csvRecordsArray, 
          headerLength, Constants.validateHeaderAndRecordLengthFlag, Constants.tokenDelimeter);
      // console.log(this.csvRecords);
      
      // if (this.csvRecords == null){
      //   // If control reached here it means csv file contains error, reset file.
      //   this.fileReset();
      // }    
    };

    // reader.onerror = function () {
    //   alert('Unable to read ' + input.files[0]);
    // };
  }

  fileReset(){
    this.fileImportInput.nativeElement.value = '';
    this.csvRecords = [];
  }

  optionSelected(sel){
    if (sel.value !== 'None') {
      if (this.selectedColData.length === 0) {
        this.selectedColData.push({
          'id' :  sel.source.id,
          'col':  sel.value
        });
      } else {
        // tslint:disable-next-line:prefer-const
        let tempData = this.selectedColData.filter(item => item.id === sel.source.id);
        if (tempData.length !== 0) { // modify selection
          tempData = this.selectedColData.filter(item => item.col === sel.value);
          if (tempData.length === 0) {
            this.selectedColData = this.selectedColData.filter(item => item.id !== sel.source.id); 
            this.selectedColData.push({
              'id' :  sel.source.id,
              'col':  sel.value
            });
          } else {
            this.selectedColData = this.selectedColData.filter(item => item.id !== sel.source.id); 
            this.snackBar.open('Each select option can only be selected once.', 'Dismiss', {
              duration: 15000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
            sel.source.value = 'None';
          }
        } else {
          tempData = this.selectedColData.filter(item => item.col === sel.value);
          if (tempData.length === 0) {
            this.selectedColData.push({
              'id' :  sel.source.id,
              'col':  sel.value
            });
          } else {
            this.selectedColData = this.selectedColData.filter(item => item.id !== sel.source.id); 
            this.snackBar.open('Each select option can only be selected once.', 'Dismiss', {
              duration: 15000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
            sel.source.value = 'None';
          }
        }
      }

      for (let i = 0; i < this.customerOrderCol.length; i++) {
        if (sel.value !== 'None' && this.customerOrderCol[i].col === sel.value) {
          this.customerOrderCol[i].selected = true;
          this.customerOrderCol[i].matchTo = sel.source.id;
          break;
        }
      }
    } else {
      this.selectedColData = this.selectedColData.filter(item => item.id !== sel.source.id); 
    }
  }

  uploadOrder() {  
    this.uploadRecords = [];
    
    if (this.template === 'paypal') { // paypal template is used
      for (let i = 1; i < this.csvRecords.length; i++) {
        // tslint:disable-next-line:prefer-const
        let jsonData = {};
        // tslint:disable-next-line:prefer-const
        let orderlines = {};
        // tslint:disable-next-line:prefer-const
        let payments = {};

        // tslint:disable-next-line:prefer-const
        let temp_quantity = 1;
        // tslint:disable-next-line:prefer-const
        let temp_amount = 1;
        payments['paymentMethod'] = 'Paypal';
        for (let j = 0; j < this.customerOrderCol.length; j++) {
          if (this.customerOrderCol[j].parent === 'orderlines') {
            orderlines[this.customerOrderCol[j].matchTo] = this.csvRecords[i][this.customerOrderCol[j].index];
            jsonData[this.customerOrderCol[j].parent] = []; // orderlines;
            if (this.customerOrderCol[j].matchTo === 'quantity') {
              temp_quantity = this.csvRecords[i][this.customerOrderCol[j].index];
            }
          } else if (this.customerOrderCol[j].parent === 'payments') {
            if (this.customerOrderCol[j].matchTo === 'amount') {
              temp_amount = this.csvRecords[i][this.customerOrderCol[j].index];
            }
            payments[this.customerOrderCol[j].matchTo] = this.csvRecords[i][this.customerOrderCol[j].index];
            jsonData[this.customerOrderCol[j].parent] = []; // payments;
          } else if (!this.customerOrderCol[j].parent) {
            jsonData[this.customerOrderCol[j].matchTo] = this.csvRecords[i][this.customerOrderCol[j].index];
          }
        }
        orderlines['saleprice'] = temp_amount / temp_quantity;
        jsonData['orderlines'][0] = orderlines;
        jsonData['payments'][0] = payments;
        this.uploadRecords.push(jsonData);
      }
    } else if (this.template === 'none') {
      this.customerOrderCol = this.customerOrderCol.filter(item => item.col !== 'None'); 
      for (let i = 1; i < this.csvRecords.length; i++) {
        // tslint:disable-next-line:prefer-const
        let jsonData = {};
        for (let j = 1; j < this.csvRecords[i].length; j++) {
          if (this.customerOrderCol[j].selected) {
            jsonData[this.customerOrderCol[j].matchTo] = this.csvRecords[i][j];
          }
        }
        this.uploadRecords.push(jsonData);
      }
    }
    console.log(this.uploadRecords);
    this.apiService.post('Orders', 'orders', null, this.uploadRecords).subscribe(
      res => {
        if (res['data']) {
          this.snackBar.open('Import successfully', 'Dismiss', {
            duration: 15000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
        }
      },
      err => {
        console.log(`Error in import order: ${err}`);
      }// ,
      // () => {
      //   console.log('solid consignment Completed');
      // }
    );

    
    // tslint:disable-next-line:prefer-const
    // let requiredCol = [];
    // for (let i = 0; i < this.uploadRecords.length; i++) {
    //   for (let j = 1; j < this.ORDERCOLUMN_DATA.length; j++) {
    //     if (this.ORDERCOLUMN_DATA[j].selected && !this.uploadRecords[0][this.ORDERCOLUMN_DATA[j].col]) {
    //       requiredCol.push(this.ORDERCOLUMN_DATA[j].col);
    //       continue;
    //     }
    //   }
    //   break;
    // }
  }

  createCustomerOrderCol(colVal: string, matchTo: string, parent: string, index: number): CustomerOrderCol {
    return {
        col      : colVal,
        selected : false,
        matchTo  : matchTo,
        parent   : parent,
        index    : index
    };
  }

  next() {
    if (!this.verticalStepperStep1.invalid) {
      this.selectTemplate = true;
      this.stepper.selected.completed = true;
      this.stepper.next();
    }
  }
}

export interface CustomerOrderCol {
  col:      string;
  selected: boolean;
  matchTo:  string;
  parent:   string;
  index:    number;
}

export interface OrderCol {
  // index: number;
  col: string;
  label: string;
  selected: boolean;
  matchTo: string;
}


