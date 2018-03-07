import { ActiveContentService } from './../../../../../app/alpha/services/activeContent.service';
import { Component, Input, Output, OnInit, OnDestroy, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { TableColumn, ColumnMode } from '@swimlane/ngx-datatable';
import { FulfillmentsService, PaginationService } from '../../../../../app/alpha/services/index';
import { Page } from '../../../../../app/alpha/models/page.model';
import 'rxjs/add/operator/takeWhile';
import { Subscription } from 'rxjs/Subscription';
import { ConsignmentsService } from '../../../services/consignments.service';
import { GridOptions } from 'ag-grid';
import { TableActionCellComponent } from '../table-cell/table-action-cell/table-action-cell.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'consignments-solid',
  templateUrl: './consignments-solid.component.html',
  styleUrls: ['./consignments-solid.component.scss'],
  providers: [
    ConsignmentsService,
  ],
})
export class ConsignmentsSolidComponent implements OnInit, OnDestroy {
  consignments;
  public gridOptions: GridOptions;
  selected: any;

  columnDefs = [
    {
      headerName: '',
      width: 10,
      checkboxSelection: true,
      headerCheckboxSelection: true
    },
    { field: 'clientIndex_id', headerName: 'ID', width: 15 },
    { field: 'shipTo_name', headerName: 'Customer', width: 40 },
    {
      field: 'shipping_method.name',
      headerName: 'Method',
      width: 30,
      // cellRendererFramework: TableOrderlinesCellComponent,
      cellStyle: {padding: 0}
    },
    {
      field: 'shipping_method.serviceProvider',
      headerName: 'Carrier',
      width: 30,
      // cellRendererFramework: TableOrderlinesCellComponent,
      cellStyle: {padding: 0}
    },
    {
      field: 'created_at',
      headerName: 'Created',
      width: 30,
      // cellRendererFramework: TableStatusCellComponent
    },
    { headerName: 'Actions', width: 10, cellRendererFramework: TableActionCellComponent}
  ];

  consignmentsSubscription: Subscription;

  constructor(
    private activeContentService: ActiveContentService,
  ) {
    this.gridOptions = <GridOptions>{
      domLayout: 'autoHeight',
      enableRangeSelection: true,
      enableColResize: true,
      pagination: false,
      paginationAutoPageSize: false,
      suppressCellSelection: true,
      suppressRowClickSelection: true,
      rowSelection: 'multiple',
      context: { componentParent: this },

      // getRowHeight: function(params) {
      //   return 48 * (params.data.orderlines.length);
      // },
      deltaRowDataMode: true,
      getRowNodeId: function(data){
        return data.id;
      },
      onSelectionChanged: () => {
        // this.selected = this.gridOptions.api.getSelectedRows();
        // if (this.selected.length){
        //   this.hasSelectedOrders = true;
        // }else{
        //   this.hasSelectedOrders = false;
        // }
      },
      onGridReady: () => {
          this.gridOptions.api.doLayout();
          this.gridOptions.api.sizeColumnsToFit();
          // this.currentOrders = 'awaitFulfill';
          this.consignmentsSubscription = this.activeContentService.onConsignmentsChange.subscribe(
            (consignments) => {
              this.consignments = consignments;
              this.gridOptions.api.setRowData(this.activeContentService.consignments.solid);
            }
          );
          this.activeContentService.getConsignments();
      }
    };
  }
  ngOnInit() {

  }

  ngOnDestroy() {
    this.consignmentsSubscription.unsubscribe();
  }
}
