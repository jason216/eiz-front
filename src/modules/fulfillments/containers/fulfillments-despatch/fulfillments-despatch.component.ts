import { Component, Input, Output, OnInit, OnDestroy, ViewChild, TemplateRef, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { TableColumn, ColumnMode } from '@swimlane/ngx-datatable';
import { FulfillmentsService, PaginationService } from '../../../../app/alpha/services/index';
import { Page } from '../../../../app/alpha/models/page.model';
import 'rxjs/add/operator/takeWhile';
import { MatInputModule } from '@angular/material/input';
import { MatInput, MatDialog } from '@angular/material';
import {  FulfillmentsDespatchDialogComponent } from '../../components/fulfillmentDespatch-dialog/fulfillmentDespatch-dialog.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'fulfillments-depatch',
  templateUrl: './fulfillments-despatch.component.html',
  styleUrls: ['./fulfillments-despatch.component.scss']
})
export class FulfillmentsDespatchComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('consignmentIndex_id', {read: MatInput}) consignmentIndex_id: MatInput;

  constructor(
    public dialog: MatDialog,
  ){

  }

  ngAfterViewInit(): void {
    // tslint:disable-next-line:no-unused-expression
  }
  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
  }
  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }

  changeFocus(){
    console.log('ssss');
  }

  openDespatchWindow(){
    const window = this.dialog.open(FulfillmentsDespatchDialogComponent, {
      // consignment_id: 123,
      width: '500px',
      height: '500px',
      data: this.consignmentIndex_id.value,
    });

    window.afterClosed().subscribe(
      event => {
        if (event.despatchSuccess === true){
          this.consignmentIndex_id.focus();
          this.consignmentIndex_id.value = '';
        }else{
          this.consignmentIndex_id.focus();
          this.consignmentIndex_id.value = 'Not success';
        }
      }
    );
  }

}
