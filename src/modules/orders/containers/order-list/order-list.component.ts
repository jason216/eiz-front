

import { DatatableComponent } from '@swimlane/ngx-datatable';
import { TableColumn, ColumnMode } from '@swimlane/ngx-datatable';

import { Component, ElementRef, TemplateRef, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { OrderService } from '../../../../app/alpha/services';

import { OrderSearchDialogComponent } from '../../components/order-search-dialog/order-search-dialog.component';
import { fuseAnimations } from '../../../../app/core/animations';
import { FuseUtils } from '../../../../app/core/fuseUtils';
import 'rxjs/add/operator/takeWhile';
import { FormControl } from '@angular/forms';
import { Page } from '../../../../app/alpha/models/page.model';
import { PaginationService } from '../../../../app/alpha/services/pagination.service';
import { FulfillmentsFormDialogComponent } from '../../../fulfillments/components/fulfillments-form-dialog/fulfillments-form-dialog.component';

@Component({
  selector: 'page-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  animations: fuseAnimations
})
export class OrderListComponent implements OnInit, OnDestroy {
  private startSubscribe: boolean = true;
  searchFormControl = new FormControl('');
  @ViewChild('myTable') table: any;
  @ViewChild('cellIconTmpl') cellIconTmpl: TemplateRef<any>;
  @ViewChild('cellCheckboxTmpl') cellCheckboxTmpl: TemplateRef<any>;
  @ViewChild('headCheckboxTmpl') headCheckboxTmpl: TemplateRef<any>;
  @ViewChild('cellTagTmpl') cellTagTmpl: TemplateRef<any>;
  @ViewChild('cellActionTmpl') cellActionTmpl: TemplateRef<any>;
  @ViewChild('cellOrderlinesTmpl') cellOrderlinesTmpl: TemplateRef<any>;

  rows: any[] = [];
  selected = [];
  hasSelectedOrders = false;
  columnsRef = [];
  page = new Page();
  expanded: any = {};
  timeout: any;
  filters = [];

  constructor(
    public dialog: MatDialog,
    public orderService: OrderService,
    public paginationService: PaginationService
  ) {
    this.page.pageNumber = 0;
    this.page.size = 12;
  }

  ngOnInit() {
    this.columnsRef = [
      {
        name: '',
        maxWidth: 20,
        sortable: false,
        draggable: false,
        cellTemplate: this.cellIconTmpl
      },
      {
        prop: 'id',
        name: 'ID',
        maxWidth: 70,
        sortable: false,
        draggable: false,
        cellTemplate: this.cellCheckboxTmpl,
        headerTemplate: this.headCheckboxTmpl
      },
      { prop: 'salesRecordNumber', name: 'SRN', maxWidth: 150 },
      { prop: 'shipTo_name', name: 'Customer', maxWidth: 150 },
      {
        prop: 'orderlines',
        name: 'Orderlines',
        cellTemplate: this.cellOrderlinesTmpl
      },
      {
        prop: 'paymentStatus',
        name: 'Payment',
        maxWidth: 150,
        cellTemplate: this.cellTagTmpl
      },
      {
        prop: 'status',
        name: 'Status',
        maxWidth: 150,
        ellTemplate: this.cellTagTmpl
      },
      //{ prop: "customer.name", name: "Name" },
      { name: 'Actions', maxWidth: 100, cellTemplate: this.cellActionTmpl }
    ];

    this.setPage({ offset: 0 });
  }
  ngOnDestroy() {
    this.startSubscribe = false;
  }

  resetFilter() {
    this.filters = null;
    this.filters = [];
    this.setPage({ offset: 0 });
  }
  private encodeFilters(filters: any) {
    let params = '';
    Object.entries(filters).forEach(([key, value]) => {
      params = params + key + '=' + value + '&';
    });
    return params;
  }

  openFulfillments(row): void {
    const dialogRef = this.dialog.open(FulfillmentsFormDialogComponent, {
      width: '1000px',
      height: '700px',
      data: row
    });

    // dialogRef
    //   .afterClosed()
    //   .takeWhile(() => this.startSubscribe)
    //   .subscribe(result => {
    //     console.log('The dialog was closed');
    //     if (result) {
    //       this.filters = result;
    //       this.handleSearch();
    //     }
    //   });
  }
  handleBasicSearch() {
    if (this.searchFormControl.value) {
      this.filters['search'] = this.searchFormControl.value;

      let params = this.encodeFilters(this.filters);
      this.handleSearch();
    }
  }
  openAdvancedSearch(): void {
    const dialogRef = this.dialog.open(OrderSearchDialogComponent, {
      width: '600px',
      data: this.filters
    });

    dialogRef
      .afterClosed()
      .takeWhile(() => this.startSubscribe)
      .subscribe(result => {
        console.log('The dialog was closed');
        if (result) {
          this.filters = result;
          this.handleSearch();
        }
      });
  }

  private handleSearch() {
    let params = this.encodeFilters(this.filters);
    this.orderService
      .getOrders(params)
      .takeWhile(() => this.startSubscribe)
      .subscribe(
        res => {
          this.searchFormControl = new FormControl('');
          let pagedData = this.paginationService.decodeResponse(res);
          this.rows = [];
          this.rows = pagedData.data;
          this.rows = pagedData.data;
          // console.log("after reset page", pagedData.page);

          this.page = pagedData.page;
          // IMPORTANT NOTE: server-side page index start at 1, ngx-datatable page index start at 0
          this.page.pageNumber = this.page.pageNumber - 1;
          // console.log('data', this.rows);
          this.table.recalculate();
        },
        err => {
          console.log(`Error in order-get-orders: ${err}`);
        }
      );
  }

  // Order Table Related functions

  setPage(pageInfo) {
    // console.log("click page info", pageInfo);
    this.page.pageNumber = pageInfo.offset + 1;
    // console.log("OFFSET", this.page.pageNumber);
    let params = '';
    params = params + this.encodeFilters(this.filters);
    params =
      this.paginationService.encodeResponse(this.page.pageNumber) +
      '&' +
      params;
    console.log('params', params);

    this.orderService
      .getOrders(params)
      .takeWhile(() => this.startSubscribe)
      .subscribe(
        res => {
          let pagedData = this.paginationService.decodeResponse(res);
          this.rows = [];
          this.rows = pagedData.data;
          this.rows = pagedData.data;
          // console.log("after reset page", pagedData.page);

          this.page = pagedData.page;
          // IMPORTANT NOTE: server-side page index start at 1, ngx-datatable page index start at 0
          this.page.pageNumber = this.page.pageNumber - 1;
          // console.log('data', this.rows);
          this.table.recalculate();
        },
        err => {
          console.log(`Error in order-get-orders: ${err}`);
        }
      );
  }

  addRow() {
    let row = this.rows[1];
    console.log('add row', row);

    let rows = [...this.rows];
    // rows.push(row);
    rows.splice(0, 0, row);
    this.rows = [...rows];
  }
  deleteRow(row, rowIndex) {
    console.log('delete index', rowIndex);
    let rows = [...this.rows];
    rows.splice(rowIndex, 1);
    this.rows = [...rows];
  }

  onSelect({ selected }) {
    console.log('Select Event', selected, this.selected);
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
    this.hasSelectedOrders = true;
  }

  onActivate(event) {
    console.log('Activate Event', event);
  }

  toggleExpandRow(row) {
    console.log('Toggled Expand Row!', row);
    this.table.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle(event) {
    console.log('Detail Toggled', event);
  }

  //selected-bar
  deselectAll() {
    this.selected = [];
    this.hasSelectedOrders = false;
  }
}
