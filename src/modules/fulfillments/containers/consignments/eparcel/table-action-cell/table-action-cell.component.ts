import { ConsignmentsService } from './../../../../services/consignments.service';
import { Component, Input } from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import { ICellRendererParams, IAfterGuiAttachedParams } from 'ag-grid';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'table-action-cell',
  templateUrl: './table-action-cell.component.html',
  styleUrls: ['../eparcel.consignments.component.scss']
})
export class EparcelTableActionCellComponent implements ICellRendererAngularComp{
  public consignment: any;
  public params: any;

  constructor(
    private consignmentsService: ConsignmentsService
  ){

  }

  refresh(params: any): boolean {
    return false;
  }
  agInit(params: any): void {
    this.consignment = params.data;
    this.params = params;
  }
  afterGuiAttached?(params?: IAfterGuiAttachedParams): void {
    this.params = params;
  }

  pirntConsignment(){
    this.consignmentsService.printConsignments([this.consignment.id]);
  }

  solidConsignment(){
    this.consignmentsService.solidConsignments([this.consignment.id]);
  }

  fixIssue () {
    this.params.context.componentParent.fixIssue([this.consignment]);
  }

  submitConsignment() {
    this.params.context.componentParent.submitConsignment([this.consignment.id]);
  }
}
