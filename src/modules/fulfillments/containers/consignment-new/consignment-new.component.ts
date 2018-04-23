import { Component, OnInit, OnDestroy, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileUtil } from './orderupload.util';
import { Constants } from './orderupload.constants';

import { MatTableDataSource } from '@angular/material';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { fuseAnimations } from '../../../../app/core/animations';
import { ApiService } from '../../../../app/alpha/services/api.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'page-consignment-new',
  templateUrl: './consignment-new.component.html',
  styleUrls: ['./consignment-new.component.scss'],
  animations: fuseAnimations
})

export class ConsignmentNewComponent implements OnInit, OnDestroy {
  private startSubscribe = true;

  consignment = {
    shipTo_ref: '',
    shipTo_name: '',
    shipTo_companyName: '',
    shipTo_phone: '',
    shipTo_email: '',
    shipTo_address1: '',
    shipTo_address2: '',
    shipTo_suburb: '',
    shipTo_postcode: '',
    shipTo_state: '',
    shipTo_country: '',
    shipTo_instruction1: '',
    shipTo_instruction2: '',
    data: []
  };

  @ViewChild('cellActionTmpl') cellActionTmpl: TemplateRef<any>;
  @ViewChild('cellEditTextTmpl') cellEditTextTmpl: TemplateRef<any>;
  columnsRef = [];
  rows: any[] = [];
  orderline = '{ "qty": 0, "weight": 0, "length": 0, "width": 0, "height": 0}';
  orderlineAdded = false;
  totalRowNum = 1;

  consignmentForm: FormGroup;
  consignmentFormErrors: any;

  defaultVal: 1;

  needCSVFile = false;

  @ViewChild('consignmentImportInput') consignmentImportInput: ElementRef;

  csvRecords = [];
  uploadData = [];

  // orderColDuplicateError = false;

  // displayedColumns = ['orderCol', 'customerOrderCol'];
  // dataSource: MatTableDataSource<OrderCol>;
  // uploadRecords = [];
  // selectedColData = [];

  // orderUploadForm: FormGroup;
  // orderUploadFormErrors: any;

  // @ViewChild('fileImportInput')
  // fileImportInput: any;

  // csvRecords = [];
  // tslint:disable-next-line:prefer-const
  // customerOrderCol: CustomerOrderCol[] = [];

  constructor(private _router: Router,
    private _fileUtil: FileUtil,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private apiService: ApiService,
  ) {
    this.consignmentFormErrors = {
      consignee: {},
      email: {},
      phone: {},
      companyName: {},
      instruction: {},
      address1: {},
      address2: {},
      suburb: {},
      state: {},
      postcode: {},
      country: {}
    };
  }
  ngOnInit() {
    this.consignmentForm = this.formBuilder.group({
      consignee: ['', [Validators.required]],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      companyName: [''],
      instruction: ['', Validators.required],
      address1: ['', Validators.required],
      address2: [''],
      suburb: ['', Validators.required],
      state: ['', Validators.required],
      postcode: ['', Validators.required],
      country: ['', Validators.required]
    });

    this.consignmentForm.valueChanges.subscribe(() => {
      this.oncConsignmentFormValuesChanged();
    });

    this.rows.push(JSON.parse(this.orderline));
    this.columnsRef = [
      { prop: 'qty', name: 'Quantity', width: 120, cellTemplate: this.cellEditTextTmpl },
      { prop: 'weight', name: 'Weight', width: 120, cellTemplate: this.cellEditTextTmpl },
      { prop: 'length', name: 'Length', width: 120, cellTemplate: this.cellEditTextTmpl },
      { prop: 'width', name: 'Width', width: 120, cellTemplate: this.cellEditTextTmpl },
      { prop: 'height', name: 'Height', width: 120, cellTemplate: this.cellEditTextTmpl },
      { name: 'Actions', width: 300, cellTemplate: this.cellActionTmpl }
    ];
  }

  ngOnDestroy() {
  }

  oncConsignmentFormValuesChanged() {
    for (const field in this.consignmentFormErrors) {
      if (!this.consignmentFormErrors.hasOwnProperty(field)) {
        continue;
      }

      // Clear previous errors
      this.consignmentFormErrors[field] = {};

      // Get the control
      const control = this.consignmentForm.get(field);

      if (control && control.dirty && !control.valid) {
        this.consignmentFormErrors[field] = control.errors;
      }
    }
  }

  addOrderLine(event, row, rowIndex) {
    this.totalRowNum = this.totalRowNum + 1;
    this.orderlineAdded = true;
    // if (event) {
    // tslint:disable-next-line:prefer-const
    let buttonDiv: HTMLDivElement = event.target;
    buttonDiv.style.display = 'none';
    buttonDiv.id = 'newBtn' + rowIndex;
    // }

    // tslint:disable-next-line:prefer-const
    let rows = [...this.rows];
    rows.push(JSON.parse(this.orderline));
    this.rows = [...rows];
    const tmp: HTMLInputElement = document.createElement('input');
    document.body.appendChild(tmp);
    tmp.focus();
    tmp.blur();
    document.body.removeChild(tmp);
  }

  deleteOrderLine(event, row, rowIndex) {
    this.totalRowNum = this.totalRowNum - 1;
    // if (rowIndex === this.rows.length - 1) {
    // tslint:disable-next-line:prefer-const
    let lastBtnId = this.totalRowNum - 1;
    // tslint:disable-next-line:prefer-const
    let newBtnId = 'newBtn' + lastBtnId; console.log(newBtnId);

    // tslint:disable-next-line:prefer-const
    let buttonDiv: HTMLElement = document.getElementById(newBtnId);
    buttonDiv.style.display = 'block';
    // }

    // tslint:disable-next-line:prefer-const
    let rows = [...this.rows];
    rows.splice(rowIndex, 1);
    this.rows = [...rows];

    if (rows.length === 0) {
      this.orderlineAdded = false;
    }
  }

  updateValue(event, cell, rowIndex) {

    // tslint:disable-next-line:prefer-const
    let val = event instanceof Date ? event : event.target.value;
    this.rows[rowIndex][cell] = val;
    this.rows = [...this.rows];
  }

  getStyle() {
    if (this.orderlineAdded) {
      return 'block';
    } else {
      return 'none';
    }
  }

  checkOrderline() {
    for (let i = 0; i < this.rows.length; i++) {
      if (this.rows[i]['qty'] === '' || this.rows[i]['qty'] === undefined) {

      }
    }
  }

  submit() {
    const regex = new RegExp(/^(\d*\.)?\d+$/); // /^[1-9]+(\.[0-9]*){0,1}$/g // /^([1-9]\d*|0)(\.\d*[1-9])?$/
    const numberInputs = document.getElementsByClassName('number') as HTMLCollectionOf<HTMLInputElement>;
    // tslint:disable-next-line:prefer-const
    let numberInputError = false;

    for (let i = 0; i < numberInputs.length; i++) {
      if (!String(numberInputs[i].value).match(regex)) {
        numberInputError = true;
        numberInputs[i].parentElement.parentElement.parentElement.parentElement.setAttribute('class', 'ng-invalid mat-input-invalid mat-form-field-invalid');
      }
    }

    if (numberInputError) {
      this.snackBar.open('Please input valid decimal number', 'Dismiss', {
        duration: 15000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      return;
    }
    // if (this.consignmentForm.invalid) {
    //   return;
    // } else if (this.checkOrderline) {
    //   // this.snackBar.open(error.error.message, 'Dismiss', {
    //   //   duration: 15000,
    //   //   horizontalPosition: 'right',
    //   //   verticalPosition: 'top',
    //   // });
    // }
    this.consignment['data'] = this.rows;
    console.log(this.consignment);
  }

  uploadconsignment(button) {
    if (this.consignmentImportInput.nativeElement.value === '') {
      this.needCSVFile = true;
      return;
    }

    button.textContent = 'Submitting...';
    button.parentElement.disabled = true;
console.log(this.uploadData);
    this.apiService.post('Fulfillments', 'consignment', null, this.uploadData).subscribe(
      res => {
          this.fileReset();
          this.snackBar.open('Import successfully', 'Dismiss', {
            duration: 15000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });

          this.uploadData = [];
          button.textContent = 'Submit';
          button.parentElement.disabled = false;
      },
      err => {
        this.snackBar.open('Error in import consignments:' + err, 'Dismiss', {
          duration: 15000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
        button.textContent = 'Submit';
          button.parentElement.disabled = false;
      }
    );
  }

  fileReset(){
    this.consignmentImportInput.nativeElement.value = '';
    this.csvRecords = [];
  }

  // METHOD CALLED WHEN CSV FILE IS IMPORTED
  fileChangeListener($event): void {
    this.needCSVFile = false;

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

      this.csvRecords = this._fileUtil.getDataRecordsArrayFromCSVFile(csvRecordsArray, 
          headerLength, !Constants.validateHeaderAndRecordLengthFlag, Constants.tokenDelimeter);

      // tslint:disable-next-line:prefer-const
      
      for (let i = 0; i < this.csvRecords.length; i++) {

        // tslint:disable-next-line:prefer-const
        let itemData = [];
        // tslint:disable-next-line:prefer-const
        let methodIds = [];
        // tslint:disable-next-line:prefer-const
        let method: number[];

        if (this.csvRecords[i][0] === 'C') {
          method = this.csvRecords[i][12].split(';');
          for (let x = 0; x < method.length; x++) {
            methodIds.push(Number(method[x]));
          }

          for (let j = i + 1; j < this.csvRecords.length; j++) {
            if (this.csvRecords[j][0] === 'A') {
              itemData.push(this.createItem(this.csvRecords[j]));
            } else {
              break;
            }
          }
         
          this.uploadData.push(this.createConsignmentCol(this.csvRecords[i], methodIds, itemData));
        }
      }
      console.log(this.uploadData);
    };

    reader.onerror = function () {
      alert('Unable to read ' + input.files[0]);
    };
  }

  createConsignmentCol(row, methodIds, itemData) {
    return {
      shipTo_ref: row[1],
      shipTo_name: row[2],
      shipTo_companyName: row[3],
      shipTo_phone: row[4],
      shipTo_email: row[5],
      shipTo_address1: row[6],
      shipTo_suburb: row[7],
      shipTo_state: row[8],
      shipTo_postcode: row[9],
      shipTo_country: row[10],
      shipTo_instruction1: row[11],
      shippingMethod_ids: methodIds,
      data: itemData
    };
  }

  createItem(itemRow) {
    return {
      qty: Number(itemRow[1]),
      weight: Number(itemRow[2]),
      length: Number(itemRow[3]),
      width: Number(itemRow[4]),
      height: Number(itemRow[5])
    };
  }
}

export interface ConsignmentCol {
  // rowType: string;
  shipTo_ref: string;
  shipTo_name: string;
  shipTo_companyName: string;
  shipTo_phone: string;
  shipTo_email: string;
  shipTo_address1: string;
  shipTo_suburb: string;
  shipTo_state: string;
  shipTo_postcode: string;
  shipTo_country: string;
  shipTo_instruction1: string;
  shippingMethod_ids: number[];
  data: Item[];
}

export interface Item {
  qty: number;
  weight: number;
  length: number;
  width: number;
  height: number;
}


