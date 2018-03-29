import { ActiveContentService } from './../../../../app/alpha/services/activeContent.service';


import { DatatableComponent } from '@swimlane/ngx-datatable';
import { TableColumn, ColumnMode } from '@swimlane/ngx-datatable';
import { GridOptions } from 'ag-grid/main';

import { Component, ElementRef, TemplateRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
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
import { TableOrderlinesCellComponent, TableActionCellComponent, TableStatusCellComponent } from '../../components';
import { Subscription } from 'rxjs/Subscription';
import { FulfillmentsBulkDialogComponent } from '../../../fulfillments/components/fulfillments-bulk-dialog/fulfillments-bulk-dialog.component';
import { OrderDetailDialogComponent } from './order-detail.component';
import { OrderEditDialogComponent } from './order-edit.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'page-order-list1',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  animations: fuseAnimations
})
export class OrderListComponent implements OnInit, OnDestroy {
  private startSubscribe = true;
  searchFormControl = new FormControl('');
  @ViewChild('myTable') table: any;
  @ViewChild('cellIconTmpl') cellIconTmpl: TemplateRef<any>;
  @ViewChild('cellCheckboxTmpl') cellCheckboxTmpl: TemplateRef<any>;
  @ViewChild('headCheckboxTmpl') headCheckboxTmpl: TemplateRef<any>;
  @ViewChild('cellTagTmpl') cellTagTmpl: TemplateRef<any>;
  @ViewChild('cellActionTmpl') cellActionTmpl: TemplateRef<any>;
  @ViewChild('cellOrderlinesTmpl') cellOrderlinesTmpl: TemplateRef<any>;

  paid = 0;
  processed = 0;
  unPaid = 0;
  issue = 0;
  onhold = 0;

  rows: any[] = [];
  selected: any = [];
  hasSelectedOrders = false;
  columnsRef = [];
  page = new Page();
  expanded: any = {};
  timeout: any;
  filters = [];
  tableDataOnLoading = false;
  public gridOptions: GridOptions;
  ordersUpdateSubscription: Subscription;
  orders;
  currentOrders;

  dialogRef: any;

  columnDefs = [
    {
      headerName: '',
      width: 10,
      checkboxSelection: true,
      headerCheckboxSelection: true
    },
    { field: 'salesRecordNumber', headerName: 'SRN', width: 25 },
    { field: 'shipTo_name', headerName: 'Customer', width: 40 },
    {
      field: 'orderlines',
      headerName: 'Orderlines',
      width: 150,
      cellRendererFramework: TableOrderlinesCellComponent,
      cellStyle: { padding: 0 }
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 30,
      cellRendererFramework: TableStatusCellComponent
    },
    { headerName: 'Actions', width: 30, cellRendererFramework: TableActionCellComponent, }
  ];

  constructor(
    public dialog: MatDialog,
    public orderService: OrderService,
    public paginationService: PaginationService,
    public activeContentService: ActiveContentService,
  ) {
    // this.page.pageNumber = 0;
    // this.page.size = 12;
    this.gridOptions = <GridOptions>{
      // domLayout: 'autoHeight',
      enableRangeSelection: true,
      enableColResize: true,
      suppressHorizontalScroll: true,
      // pagination: true,
      // paginationAutoPageSize: true,
      suppressCellSelection: true,
      suppressRowClickSelection: true,
      rowSelection: 'multiple',
      rowStyle: {cursor: 'pointer'},
      context: { componentParent: this },

      getRowHeight: function (params) {
        return 48 * (params.data.orderlines.length);
      },
      deltaRowDataMode: true,
      getRowNodeId: function (data) {
        return data.id;
      },
      onSelectionChanged: () => {
        this.selected = this.gridOptions.api.getSelectedRows();
        if (this.selected.length) {
          this.hasSelectedOrders = true;
        } else {
          this.hasSelectedOrders = false;
        }
      },
      onGridReady: () => {
        this.gridOptions.api.doLayout();
        this.gridOptions.api.sizeColumnsToFit();
        this.currentOrders = 'paid';
        this.ordersUpdateSubscription = this.activeContentService.onOrdersChange.subscribe(
          (orders) => {
            this.orders = orders;
            this.gridOptions.api.setRowData(orders[this.currentOrders]);
            if (orders['paid']) {
              this.paid = orders['paid'].length;
              this.processed = orders['processed'].length;
              this.unPaid = orders['unpaid'].length;
              this.issue = orders['issue'].length;
              this.onhold = orders['onhold'].length;
            }
          }
        );
        this.activeContentService.getOrders();
        // this.gridOptions.api.setRowData(activeContentService.orders);
        // this.orderService
        // .getOrders({size: 99999})
        // .takeWhile(() => this.startSubscribe)
        // .subscribe(
        //   res => {
        //     this.gridOptions.api.setRowData(res.data);
        //   },
        //   err => {
        //     console.log(`Error in order-get-orders: ${err}`);
        //   }
        // );
      }
    };
  }

  ngOnInit() {

  }
  ngOnDestroy() {
    this.startSubscribe = false;
    this.ordersUpdateSubscription.unsubscribe();
  }

  viewOrderDetail(order) {
    this.dialogRef = this.dialog.open(OrderDetailDialogComponent, {
      panelClass: 'order-detail-dialog',
      data: order
    });
    // this.dialogRef.afterClosed()
    //   .subscribe(response => {
    //     if (!response) {
    //       return;
    //     }
    //     const actionType: string = response[0];
    //     const formData: FormGroup = response[1];
    //     switch (actionType) {
    //       /**
    //        * Send
    //        */
    //       case 'send':
    //         console.log('new Mail', formData.getRawValue());
    //         break;
    //       /**
    //        * Delete
    //        */
    //       case 'delete':
    //         console.log('delete Mail');
    //         break;
    //     }
    //   });
  }

  setCurrentOrders(tag) {
    this.currentOrders = tag;
    this.gridOptions.api.setRowData(this.orders[this.currentOrders]);
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
      height: '580px',
      data: row
    });

    dialogRef.afterClosed().subscribe(result => {
      this.activeContentService.getOrders();
    });
  }

  bulkProcess() {
    const orders = this.gridOptions.api.getSelectedRows();
    const dialogRef = this.dialog.open(FulfillmentsBulkDialogComponent, {
      width: '1000px',
      height: '580px',
      data: orders
    });

    dialogRef.afterClosed().subscribe(result => {
      this.activeContentService.getOrders();
    });
  }

  handleBasicSearch() {
    if (this.searchFormControl.value) {
      this.filters['search'] = this.searchFormControl.value;

      const params = this.encodeFilters(this.filters);
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
    const params = this.encodeFilters(this.filters);
    this.orderService
      .getOrders(params)
      .takeWhile(() => this.startSubscribe)
      .subscribe(
        res => {
          this.searchFormControl = new FormControl('');
          // const pagedData = this.paginationService.decodeResponse(res);
          this.rows = [];
          this.rows = res;
          this.rows = res;
          // console.log("after reset page", pagedData.page);

          // this.page = pagedData.page;
          // IMPORTANT NOTE: server-side page index start at 1, ngx-datatable page index start at 0
          // this.page.pageNumber = this.page.pageNumber - 1;
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
    this.tableDataOnLoading = true;
    const params = { page: pageInfo.offset + 1 };

    this.filters.forEach(([key, value]) => {
      params[key] = value;
    });

    this.orderService
      .getOrders(params)
      .takeWhile(() => this.startSubscribe)
      .subscribe(
        res => {
          const pagedData = this.paginationService.decodeResponse(res);
          this.rows = [];
          this.rows = pagedData.data;
          this.rows = pagedData.data;

          this.page = pagedData.page;
          this.page.pageNumber = this.page.pageNumber - 1;
          this.tableDataOnLoading = false;
        },
        err => {
          console.log(`Error in order-get-orders: ${err}`);
        }
      );
  }

  addRow() {
    const row = this.rows[1];
    console.log('add row', row);

    const rows = [...this.rows];
    // rows.push(row);
    rows.splice(0, 0, row);
    this.rows = [...rows];
  }
  deleteRow(row, rowIndex) {
    console.log('delete index', rowIndex);
    const rows = [...this.rows];
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

  deselectAll() {
    this.selected = [];
    this.gridOptions.api.deselectAll();
    this.hasSelectedOrders = false;
  }

  optionSelected(tag) {
    this.setCurrentOrders(tag);
  }

  editOrder(selectedOrder) {
    this.dialogRef = this.dialog.open(OrderEditDialogComponent, {
      panelClass: 'order-edit-dialog',
      data: selectedOrder
    });
  }
}
