import { Component, Input } from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import { ICellRendererParams, IAfterGuiAttachedParams } from 'ag-grid';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'table-orderlines-cell',
  templateUrl: './table-orderlines-cell.component.html',
})
export class TableOrderlinesCellComponent implements ICellRendererAngularComp{
  public orderlines: any;

  refresh(params: any): boolean {
    return false;
  }
  agInit(params: ICellRendererParams): void {
    this.orderlines = params.value;
  }
  afterGuiAttached?(params?: IAfterGuiAttachedParams): void {

  }
}
