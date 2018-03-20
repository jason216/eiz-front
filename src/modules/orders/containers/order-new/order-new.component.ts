import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileUtil } from './orderupload.util';
import { Constants } from './orderupload.constants';

import {MatTableDataSource} from '@angular/material';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { fuseAnimations } from '../../../../app/core/animations';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'page-order-new',
  templateUrl: './order-new.component.html',
  styleUrls: ['./order-new.component.scss'],
  animations: fuseAnimations
})

export class OrderNewComponent implements OnInit, OnDestroy {
  private startSubscribe = true;

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

  // orderUploadForm: FormGroup;
  // orderUploadFormErrors: any;

  @ViewChild('fileImportInput')
  fileImportInput: any;

  csvRecords = [];
  // tslint:disable-next-line:prefer-const
  customerOrderCol: CustomerOrderCol[] = [];

  constructor(private _router: Router,
    private _fileUtil: FileUtil,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ){

  }
  ngOnInit() {
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
        
        for ( let i = 0; i < headersRow.length; i++ )
        {
          // if (i === 0) {
          //   this.customerOrderCol.push({col: 'None', selected: false, matchTo: null});
          // }
          this.customerOrderCol.push(this.createCustomerOrderCol(headersRow[i]));
        }
        
        this.dataSource = new MatTableDataSource(this.ORDERCOLUMN_DATA);
        headerLength = headersRow.length; 
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
    // tslint:disable-next-line:prefer-const
    let elem: Element = document.getElementById('postage');

    this.uploadRecords = [];
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
    
    // tslint:disable-next-line:prefer-const
    let requiredCol = [];
    for (let i = 0; i < this.uploadRecords.length; i++) {
      for (let j = 1; j < this.ORDERCOLUMN_DATA.length; j++) {
        if (this.ORDERCOLUMN_DATA[j].selected && !this.uploadRecords[0][this.ORDERCOLUMN_DATA[j].col]) {
          requiredCol.push(this.ORDERCOLUMN_DATA[j].col);
          continue;
        }
      }
      break;
    }
  }

  createCustomerOrderCol(colVal: string): CustomerOrderCol {
    return {
        col      : colVal,
        selected : false,
        matchTo  : null
    };
  }
}

export interface CustomerOrderCol {
  col: string;
  selected: boolean;
  matchTo: string;
}

export interface OrderCol {
  // index: number;
  col: string;
  label: string;
  selected: boolean;
  matchTo: string;
}

