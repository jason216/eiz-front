import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileUtil } from './orderupload.util';
import { Constants } from './orderupload.constants';

import { MatTableDataSource } from '@angular/material';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { fuseAnimations } from '../../../../app/core/animations';

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
  orderline = '{ "qty": 0, "weight": 0, "leight": 0, "width": 0, "height": 0}';
  orderlineAdded = false;
  totalRowNum = 1;

  consignmentForm: FormGroup;
  consignmentFormErrors: any;

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
    private snackBar: MatSnackBar
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
      this.oncCnsignmentFormValuesChanged();
    });

    this.rows.push(JSON.parse(this.orderline));
    this.columnsRef = [
      { prop: 'qty', name: 'Quantity', width: 120, cellTemplate: this.cellEditTextTmpl },
      { prop: 'weight', name: 'Weight', width: 120, cellTemplate: this.cellEditTextTmpl },
      { prop: 'leight', name: 'Leight', width: 120, cellTemplate: this.cellEditTextTmpl },
      { prop: 'width', name: 'Width', width: 120, cellTemplate: this.cellEditTextTmpl },
      { prop: 'height', name: 'Height', width: 120, cellTemplate: this.cellEditTextTmpl },
      { name: 'Actions', width: 300, cellTemplate: this.cellActionTmpl }
    ];
  }

  ngOnDestroy() {
  }

  oncCnsignmentFormValuesChanged() {
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
    let buttonDiv: HTMLDivElement = document.getElementById(newBtnId);
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

  onKeyup(event: any) {
    // tslint:disable-next-line:prefer-const
    let txt = event.target.value; console.log(txt);
    // let indexstr;
    // if (txt.indexOf('.') === -1) {
    //   indexstr = txt.length;
    // } else {
    //   indexstr = txt.indexOf('.');
    // }
    // if ((txt.length - indexstr + 1) >= 2) {
    //   // tslint:disable-next-line:prefer-const
    //   let len = txt.indexOf('.') + 1 + 2;
    //   event.target.value = txt.substr(0, len);
    // }

    // 先把非数字的都替换掉，除了数字和.
    txt = txt.replace(/[^\d.]/g, '');
    // 必须保证第一个为数字而不是.
    txt = txt.replace(/^\./g, '');
    // 保证只有出现一个.而没有多个.
    txt = txt.replace(/\.{2,}/g, '');
    // 保证.只出现一次，而不能出现两次以上
    txt = txt.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');

    event.target.value = txt;
  }

  checkOrderline() {
    for (let i = 0; i < this.rows.length; i++) {
      if (this.rows[i]['qty'] === '' || this.rows[i]['qty'] === undefined) {

      }
    }
  }

  submit() {
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
}


