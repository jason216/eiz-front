import { ActiveContentService } from './../../../../../app/alpha/services/activeContent.service';
import { Component, Input, Output, OnInit, OnDestroy, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { TableColumn, ColumnMode } from '@swimlane/ngx-datatable';
import { FulfillmentsService, PaginationService } from '../../../../../app/alpha/services/index';
import { Page } from '../../../../../app/alpha/models/page.model';
import 'rxjs/add/operator/takeWhile';
import { Subscription } from 'rxjs/Subscription';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'consignments-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class ConsignmentsSideNavComponent implements OnInit, OnDestroy {

  consignments;
  consignmentsUpdateSubscription: Subscription;

  constructor(
    activeContentService: ActiveContentService
  ) {
    this.consignmentsUpdateSubscription = activeContentService.onConsignmentsChange.subscribe(
      (consignments) => {
        this.consignments = consignments;
      }
    );
  }
  ngOnInit() {

  }

  ngOnDestroy() {
    this.consignmentsUpdateSubscription.unsubscribe();
  }
}
