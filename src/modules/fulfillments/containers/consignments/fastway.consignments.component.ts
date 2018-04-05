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
import { MatDialog } from '@angular/material';
import { ConsignmentEditDialogComponent } from './consignment-edit/consignment-edit.component';
import { ConsignmentsService } from '../../services/consignments.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'fastway-consignments',
  templateUrl: './fastway.consignments.component.html',
  styleUrls: ['./fastway.consignments.component.scss'],
  animations: fuseAnimations
})
export class FastwayConsignmentsComponent implements OnInit, OnDestroy {

  searchFormControl = new FormControl('');

  consignemntStatusFilter;
  hasSelectedConsignments = false;
  selected: any = [];
  selectedStatus = 'solid';

  Pending = 0;
  Solid = 0;
  Printed = 0;
  Issue = 0;

  consignments;
  currentConsignments;
  currentProvider;
  consignmentsSubscription: Subscription;

  dialogRef: any;

  gridOptions: GridOptions;
  columnDefs = [
    {
      headerName: '',
      width: 1,
      checkboxSelection: true,
      headerCheckboxSelection: true
    },
    { 
      field: 'labels.labelNumber', 
      headerName: 'Tracking Number', 
      width: 22, 
      cellRenderer: function(param) {
        if (param.data.errors) {
          return '<span style="color: red;">' + param.data.errors + '</span>';
        } else {
          // tslint:disable-next-line:prefer-const
          let trackingNum: string;
          trackingNum = '<span>';

          const labels = param.data.labels;
          for (let i = 0; i < labels.length; i++) {
            trackingNum = trackingNum + labels[0].labelNumber;
            trackingNum = trackingNum + ', ';
          }
          trackingNum = trackingNum + '</span><br>111<br>';
          return trackingNum;
        }
      }
    },
    // { 
    //   field: 'shipTo_name', 
    //   headerName: 'Customer', 
    //   width: 20
    // },
    // {
    //   field: 'shipping_method.serviceProvider',
    //   headerName: 'Carrier',
    //   width: 20
    // },
    {
      field: 'shipping_method.name',
      headerName: 'Method',
      width: 10
    },
    {
      field: 'created_at',
      headerName: 'Created',
      width: 15
    },
    {
      field: 'processed',
      headerName: 'Processed',
      width: 11,
      cellRenderer: function(param) {
        if (param.data.processed === 1) {
          return '<mat-icon class="active-icon mat-green-600-bg s-16 material-icons">check</mat-icon>';
        }
      }
    },
    {
      field: 'printed',
      headerName: 'Printed',
      width: 5,
      cellRenderer: function(param) {
        if (param.data.printed === 1) {
          return '<mat-icon class="active-icon mat-green-600-bg s-16 material-icons">check</mat-icon>';
        }
      }
    },
    // {
    //   field: 'shipped',
    //   headerName: 'Shipped',
    //   width: 5,
    //   cellRenderer: function(param) {
    //     if (param.data.shipped === 1) {
    //       return '<mat-icon class="active-icon mat-green-600-bg s-16 material-icons">check</mat-icon>';
    //     }
    //   }
    // },
    // {
    //   field: 'closed',
    //   headerName: 'Closed',
    //   width: 5,
    //   cellRenderer: function(param) {
    //     if (param.data.closed === 1) {
    //       return '<mat-icon class="active-icon mat-green-600-bg s-16 material-icons">check</mat-icon>';
    //     }
    //   }
    // },
    {
      field: 'errors',
      headerName: 'Issue',
      width: 5,
      cellRenderer: function(param) {
        if (param.data.errors) {
          return '<mat-icon class="active-icon mat-red-600-bg s-16 material-icons">error</mat-icon>';
        }
      }
    },
    { headerName: 'Actions', width: 5, cellRendererFramework: TableActionCellComponent}
  ];

  constructor(
    private activeContentService: ActiveContentService,
    private consignmentsService: ConsignmentsService,
    public dialog: MatDialog,
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
      context: { componentParent: this },
      deltaRowDataMode: true,
      getRowNodeId: function (data) {
        return data.id;
      },
      onSelectionChanged: () => {
        this.selected = this.gridOptions.api.getSelectedRows();
        if (this.selected.length) {
          this.hasSelectedConsignments = true;
        } else {
          this.hasSelectedConsignments = false;
        }
      },
      onGridReady: () => {
          this.gridOptions.api.doLayout();
          this.gridOptions.api.sizeColumnsToFit();
          this.currentConsignments = 'solid';
          this.consignmentsSubscription = this.activeContentService.onConsignmentsChange.subscribe(
            (consignments) => {
              if (consignments.fastway) {
                this.consignments = consignments.fastway;
                this.gridOptions.api.setRowData(consignments.fastway[this.currentConsignments]);
                if (consignments.fastway['pending']) {
                  this.Pending = consignments.fastway['pending'].length;
                  this.Solid = consignments.fastway['solid'].length;
                  this.Printed = consignments.fastway['printed'].length;
                  this.Issue = consignments.fastway['issue'].length;
                  
                  if (!this.consignemntStatusFilter) {
                    this.consignemntStatusFilter = 'solid';
                  }
                }
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
    this.selectedStatus = tag;
    this.setCurrentOrders(tag);
  }

  deselectAll() {
    this.selected = [];
    this.gridOptions.api.deselectAll();
    this.hasSelectedConsignments = false;
  }

  bulkSolidConsignment(event){
    event.parentElement.disabled = true;
    event.parentElement.textContent = 'Submiting';
    this.selected = this.gridOptions.api.getSelectedRows();
    // tslint:disable-next-line:prefer-const
    let ids = [];
    for (let i = 0; i < this.selected.length; i++) {
      ids.push(this.selected[i].id);
    }

    // this.consignmentsService.solidConsignments();
  }

  bulkPrintConsignment(event){
    event.parentElement.disabled = true;
    event.parentElement.textContent = 'Submiting';

    this.selected = this.gridOptions.api.getSelectedRows();
    // tslint:disable-next-line:prefer-const
    let ids = [];
    for (let i = 0; i < this.selected.length; i++) {
      ids.push(this.selected[i].id);
    }

    this.consignmentsService.printConsignments(ids);
  }

  bulkSubmitConsignment(event){
    event.parentElement.disabled = true;
    event.parentElement.textContent = 'Submiting';

    this.selected = this.gridOptions.api.getSelectedRows();
    // tslint:disable-next-line:prefer-const
    let ids = [];
    for (let i = 0; i < this.selected.length; i++) {
      ids.push(this.selected[i].id);
    }

    this.consignmentsService.submitFastwayConsignments(ids);
  }

  fixIssue (issueConsignment) {
    this.dialogRef = this.dialog.open(ConsignmentEditDialogComponent, {
      panelClass: 'consignment-edit-dialog',
      data: issueConsignment
    });
  }
}


