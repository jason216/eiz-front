import { Component, Input, Output, OnInit, OnDestroy, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { TableColumn, ColumnMode } from '@swimlane/ngx-datatable';
import { FulfillmentsService, PaginationService } from '../../../../../app/alpha/services/index';
import { Page } from '../../../../../app/alpha/models/page.model';
import 'rxjs/add/operator/takeWhile';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'consignments-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class ConsignmentsSideNavComponent implements OnInit, OnDestroy {



  constructor(

  ) {

  }
  ngOnInit() {

  }

  ngOnDestroy() {

  }
}
