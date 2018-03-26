import { Component, Input } from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import { ICellRendererParams, IAfterGuiAttachedParams } from 'ag-grid';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'table-action-cell',
  templateUrl: './table-action-cell.component.html',
})
export class TableActionCellComponent implements ICellRendererAngularComp{
  public order: any;
  public params: any;
  unpaidorder = false;

  refresh(params: any): boolean {
    return false;
  }
  agInit(params: any): void {
    this.order = params.data;
    this.params = params;

    if (this.order.status === 'unpaid') {
      this.unpaidorder = true;
    }
  }
  afterGuiAttached?(params?: IAfterGuiAttachedParams): void {
    this.params = params;
  }

  openFulfillments() {
    this.params.context.componentParent.openFulfillments([this.order]);
  }

  editOrder() {
    this.params.context.componentParent.editOrder([this.order]);
  }

  viewOrderDetail() {
    this.params.context.componentParent.viewOrderDetail([this.order]);
  }
}
