import { Component, Input, Output, OnInit, OnDestroy, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { TableColumn, ColumnMode } from '@swimlane/ngx-datatable';
import { FulfillmentsService, PaginationService } from '../../../../../app/alpha/services/index';
import { Page } from '../../../../../app/alpha/models/page.model';
import 'rxjs/add/operator/takeWhile';
import { Subscription } from 'rxjs/Subscription';
import { ConsignmentsService } from '../../../services/consignments.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'consignments-all',
  templateUrl: './consignments-all.component.html',
  styleUrls: ['./consignments-all.component.scss'],
  providers: [
    ConsignmentsService,
  ],
})
export class ConsignmentsAllComponent implements OnInit, OnDestroy {
  consignments: any[];

  consignmentsSubscription: Subscription;
  constructor(
    private consignmentsService: ConsignmentsService,
  ) {

  }
  ngOnInit() {
    this.consignmentsSubscription = this.consignmentsService.onConsignmentsUpdate.subscribe(
      (res) => {
        this.consignments = res.data;
      }
    );

    this.consignmentsService.getConsignments();
  }

  ngOnDestroy() {
    this.consignmentsSubscription.unsubscribe();
  }
}