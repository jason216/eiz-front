import { Component, Input } from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import { ICellRendererParams, IAfterGuiAttachedParams } from 'ag-grid';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'table-status-cell',
  templateUrl: './table-status-cell.component.html',
})
export class TableStatusCellComponent implements ICellRendererAngularComp{

  order: any;

  paid = false;
  fulfilled = false;

  refresh(params: any): boolean {
    return false;
  }
  agInit(params: ICellRendererParams): void {
    this.order = params.data;
    this.order.tags.forEach(tag => {
      if (tag.id === 1){
        this.fulfilled = true;
      }

      if (tag.id === 3){
        this.paid = true;
      }
    });
  }
  afterGuiAttached?(params?: IAfterGuiAttachedParams): void {

  }
}
