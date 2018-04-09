import { Component, OnInit, OnDestroy } from '@angular/core';
import { fuseAnimations } from '../../../../app/core/animations';
import { TableOrderlinesCellComponent } from '../../components/table-orderlines-cell/table-orderlines-cell.component';
import { GridOptions } from 'ag-grid';
import { Subscription } from 'rxjs/Subscription';
import { OrderService } from '../../../../app/alpha/services/order.service';
import { ActiveContentService } from '../../../../app/alpha/services/activeContent.service';


@Component({
    // tslint:disable-next-line:component-selector
    selector: 'page-order-list1',
    templateUrl: './order-list.component.html',
    styleUrls: ['./order-list.component.scss'],
    animations: fuseAnimations
})
export class OrderArchivedListComponent implements OnInit, OnDestroy {

    rows: any[] = [];
    selected: any = [];
    hasSelectedOrders = false;
    columnsRef = [];
    gridOptions: GridOptions;

    ordersUpdateSubscription: Subscription;
    orders;

    columnDefs = [
        { field: 'salesRecordNumber', headerName: 'SRN', width: 25 },
        { field: 'shipTo_name', headerName: 'Customer', width: 40 },
        {
          field: 'orderlines',
          headerName: 'Orderlines',
          width: 150,
          cellRendererFramework: TableOrderlinesCellComponent,
          cellStyle: { padding: 0 }
        }
    ];

    constructor (
        public orderService: OrderService,
        public activeContentService: ActiveContentService,
    ) {
        this.gridOptions = <GridOptions>{
            // domLayout: 'autoHeight',
            enableRangeSelection: true,
            enableColResize: true,
            suppressHorizontalScroll: false,
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
              this.ordersUpdateSubscription = this.activeContentService.onOrdersChange.subscribe(
                (orders) => {
                  this.orders = orders;
                  this.gridOptions.api.setRowData(orders['archived']);
                }
              );
              this.activeContentService.getOrders();
            }
          };
    }

    ngOnDestroy(): void {

    }
    ngOnInit(): void {

    }
}
