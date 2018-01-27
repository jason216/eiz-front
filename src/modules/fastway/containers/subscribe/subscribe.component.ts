import { Component, Input, Output, OnInit, OnDestroy, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { TableColumn, ColumnMode } from '@swimlane/ngx-datatable';
import { FulfillmentsService, PaginationService } from '../../../../app/alpha/services/index';
import 'rxjs/add/operator/takeWhile';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'fastway-subscribe',
  templateUrl: './fulfillments-all.component.html',
  styleUrls: ['./fulfillments-all.component.scss']
})
export class FulfillmentsAllComponent implements OnInit, OnDestroy {
  private startSubscribe: boolean = true;

  rows: any[] = [];
  columnsRef: any[] = [];
  page = new Page();
  @ViewChild('myTable') table: any;
  @ViewChild('cellActionTmpl') cellActionTmpl: TemplateRef<any>;
  @ViewChild('cellEditTextTmpl') cellEditTextTmpl: TemplateRef<any>;

  constructor(
    private fulfillmentsService: FulfillmentsService,
    private paginationService: PaginationService
  ) {
    this.page.pageNumber = 0;
    this.page.size = 12;
  }
  ngOnInit() {
    // this.rows.push(JSON.parse(this.orderline));
    this.columnsRef = [
      { prop: 'consigmentable_id', name: 'ConsignmentID', editable: true },
      { prop: 'manifest_id', name: 'ManifestID', editable: true },
      { prop: 'shipTo_ref', name: 'RF', editable: true },
      { prop: 'cost', name: 'Cost', editable: true },
      { prop: 'shipTo_address1', name: 'Address', editable: true },
      { prop: 'ref', name: 'REF', editable: true },
      { prop: 'labels', name: 'Labels', editable: true },
      { prop: 'created', name: 'created', editable: true },
      { prop: 'printed', name: 'printed', editable: true },
      { name: 'Actions', maxWidth: 300, cellTemplate: this.cellActionTmpl }
    ];
    this.setPage({ offset: 0 });
  }

  ngOnDestroy() {
    this.startSubscribe = false;
  }

  setPage(pageInfo) {
    // console.log("click page info", pageInfo);
    this.page.pageNumber = pageInfo.offset + 1;
    // console.log("OFFSET", this.page.pageNumber);
    let params = '';
    params =
      this.paginationService.encodeResponse(this.page.pageNumber) +
      '&' +
      params;
    console.log('params', params);

    this.fulfillmentsService
      .getConsignment(params)
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
}
