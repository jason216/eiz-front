import { Component, Input, Output, OnInit, OnDestroy, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { TableColumn, ColumnMode } from '@swimlane/ngx-datatable';
import { FulfillmentsService, PaginationService } from '../../../../app/alpha/services/index';
import { Page } from '../../../../app/alpha/models/page.model';
import 'rxjs/add/operator/takeWhile';
import { GridOptions } from 'ag-grid';
import { ActiveContentService } from '../../../../app/alpha/services/activeContent.service';
import { Subscription } from 'rxjs/Subscription';
import { TableActionCellComponent } from './table-cell/table-action-cell/table-action-cell.component';
import { fuseAnimations } from '../../../../app/core/animations';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'consignments',
  templateUrl: './consignments.component.html',
  styleUrls: ['./consignments.component.scss'],
  animations: fuseAnimations
})
export class ConsignmentsComponent implements OnInit, OnDestroy {

  searchFormControl = new FormControl('');

  Pending = 0;
  Solid = 0;
  Printed = 0;
  Issue = 0;

  consignments;
  currentConsignments;
  currentProvider;
  consignmentsSubscription: Subscription;

  gridOptions: GridOptions;
  columnDefs = [
    {
      headerName: '',
      width: 5,
      checkboxSelection: true,
      headerCheckboxSelection: true
    },
    { field: 'clientIndex_id', headerName: 'ID', width: 5 },
    { 
      field: 'shipTo_name', 
      headerName: 'Customer', 
      width: 15
    },
    {
      field: 'shipping_method.serviceProvider',
      headerName: 'Carrier',
      width: 15,
      cellStyle: {padding: 0}
    },
    {
      field: 'shipping_method.name',
      headerName: 'Method',
      width: 20,
      cellStyle: {padding: 0}
    },
    {
      field: 'created_at',
      headerName: 'Created',
      width: 20
    },
    { headerName: 'Actions', width: 10, cellRendererFramework: TableActionCellComponent}
  ];

  constructor(
    private activeContentService: ActiveContentService,
  ) {
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
      context: { componentParent: this },
      deltaRowDataMode: true,
      getRowNodeId: function(data){
        return data.id;
      },
      onSelectionChanged: () => {
      },
      onGridReady: () => {
          this.gridOptions.api.doLayout();
          this.gridOptions.api.sizeColumnsToFit();
          this.currentConsignments = 'pending';
          this.consignmentsSubscription = this.activeContentService.onConsignmentsChange.subscribe(
            (consignments) => {
              this.consignments = consignments;
              this.gridOptions.api.setRowData(consignments[this.currentConsignments]);
              if (consignments['pending']) {
                this.Pending = consignments['pending'].length;
                this.Solid = consignments['solid'].length;
                this.Printed = consignments['printed'].length;
                this.Issue = consignments['issue'].length;
              }
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

  setCurrentOrders(tag) {
    this.currentConsignments = tag;
    this.gridOptions.api.setRowData(this.consignments[this.currentConsignments]);
  }


  optionSelected(tag) {
    this.setCurrentOrders(tag);
  }
}
