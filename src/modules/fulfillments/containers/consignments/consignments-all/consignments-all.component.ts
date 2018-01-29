import { Component, Input, Output, OnInit, OnDestroy, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { TableColumn, ColumnMode } from '@swimlane/ngx-datatable';
import { FulfillmentsService, PaginationService } from '../../../../../app/alpha/services/index';
import { Page } from '../../../../../app/alpha/models/page.model';
import 'rxjs/add/operator/takeWhile';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'consignments-all',
  templateUrl: './consignments-all.component.html',
  styleUrls: ['./consignments-all.component.scss']
})
export class ConsignmentsAllComponent implements OnInit, OnDestroy {
  rows = [
    { name: 'Austin', gender: 'Male', company: 'Swimlane' },
    { name: 'Dany', gender: 'Male', company: 'KFC' },
    { name: 'Molly', gender: 'Female', company: 'Burger King' },
  ];
  constructor(

  ) {

  }
  ngOnInit() {

  }

  ngOnDestroy() {

  }
}
