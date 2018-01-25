import { Component, Input, Output, OnInit, OnDestroy, ViewChild, TemplateRef, ElementRef, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { TableColumn, ColumnMode } from '@swimlane/ngx-datatable';
import { FulfillmentsService, ConsignmentService } from '../../../../app/alpha/services';
import { Consignment } from '../../../../app/alpha/models/consignment.model';


@Component({
  selector: "parcel-quote-form",
  templateUrl: "./parcel-quote-form.component.html",
  styleUrls: ["./parcel-quote-form.component.scss"],
  providers: [ConsignmentService]
})
export class ParcelQuoteFormComponent implements OnInit, OnDestroy {
  private startSubscribe: boolean = true;
  @ViewChild("cellActionTmpl") cellActionTmpl: TemplateRef<any>;
  @ViewChild("cellEditTextTmpl") cellEditTextTmpl: TemplateRef<any>;
  parcel = '{ "qty": 0, "length": 0, "width": 0, "height": 0}';
  rows: any[] = [];
  columnsRef: any[] = [];
  shippingMethods = [
    {
      shippingMethod_id: 1,
      shippingMethod_name: "fastway",
      shippingMethod_cost: 11
    },
    {
      shippingMethod_id: 2,
      shippingMethod_name: "fastway2",
      shippingMethod_cost: 22
    },
    {
      shippingMethod_id: 3,
      shippingMethod_name: "fastway3",
      shippingMethod_cost: 33
    }
  ];

  selectedShippingMethod: any;
  get consignment(): Consignment {
    return this.consignmentService.consignment;
  }

  @Input()
  set consignment(data: Consignment) {
    this.consignmentService.consignment = data;
  }


  @Output() onUpdated = new EventEmitter<boolean>();

  constructor(
    private consignmentService: ConsignmentService,
    private fulfillmentsService: FulfillmentsService
  ) {}
  ngOnInit() {
    console.log("table data is", this.consignment.data);

    this.rows = this.consignment.data;
    this.rows = [...this.rows];
    //this.rows.push(JSON.parse(this.parcel));
    this.columnsRef = [
      {
        prop: "qty",
        name: "Qty",
        editable: true,
        cellTemplate: this.cellEditTextTmpl
      },
      {
        prop: "length",
        name: "L",
        editable: true,
        cellTemplate: this.cellEditTextTmpl
      },
      {
        prop: "width",
        name: "W",
        editable: true,
        cellTemplate: this.cellEditTextTmpl
      },
      {
        prop: "height",
        name: "H",
        editable: true,
        cellTemplate: this.cellEditTextTmpl
      },
      {
        name: "Actions",
        minWidth: 160,
        maxWidth: 160,
        cellTemplate: this.cellActionTmpl
      }
    ];
  }

  ngOnDestroy() {
    this.startSubscribe = false;
  }

  quotePrices() {
    // this.fulfillmentsService
    //   .getConsignment(this.rows)
    //   .takeWhile(() => this.startSubscribe)
    //   .subscribe(
    //     res => {
    //       let pagedData = this.paginationService.decodeResponse(res);
    //       this.rows = [];
    //       this.rows = pagedData.data;
    //       this.rows = pagedData.data;
    //       // console.log("after reset page", pagedData.page);
    //       this.page = pagedData.page;
    //       // IMPORTANT NOTE: server-side page index start at 1, ngx-datatable page index start at 0
    //       this.page.pageNumber = this.page.pageNumber - 1;
    //       // console.log('data', this.rows);
    //       this.table.recalculate();
    //     },
    //     err => {
    //       console.log(`Error in order-get-orders: ${err}`);
    //     }
    //   );
  }

  updateValue(event, cell, rowIndex) {
    var val = event instanceof Date ? event : event.target.value;
    this.rows[rowIndex][cell] = val;
    this.rows = [...this.rows];

    this.consignment.data = [...this.rows];
    this.consignmentService.saveConsignment();
    this.onUpdated.emit(true);
    // var val = event instanceof Date ? event : event.target.value;
    // this.consignment.data[rowIndex][cell] = val;
    // this.consignment.data = [...this.consignment.data];
  }
  addRow() {
    let rows = [...this.rows];
    rows.push(JSON.parse(this.parcel));
    this.rows = [...rows];
    // const tmp: HTMLInputElement = document.createElement("input");
    // document.body.appendChild(tmp);
    // tmp.focus();
    // tmp.blur();
    // document.body.removeChild(tmp);

    this.consignment.data = [...rows];
    // console.log("add row to consignment", this.consignment.data);

    this.consignmentService.saveConsignment();
    this.onUpdated.emit(true);
  }

  deleteRow(row, rowIndex) {
    //console.log('delete index', rowIndex);
    let rows = [...this.rows];
    rows.splice(rowIndex, 1);
    this.rows = [...rows];

    //console.log('delete index', rowIndex);
    this.consignment.data = [...this.rows];
    this.consignmentService.saveConsignment();
    this.onUpdated.emit(true);
  }

  updateShippingInfo(id, cost) {
    this.consignment.shippingMethod_id = id;
    this.consignment.shippingMethod_cost = cost;
    this.consignmentService.saveConsignment();
    this.onUpdated.emit(true);
  }
}
