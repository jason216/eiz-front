import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { SharedModule } from '../../app/core/modules/shared.module';
import { FuseMainModule } from '../../app/main/main.module';

import { BasicModule } from '../../app/basic/basic.module';
import { AlphaModule } from '../../app/alpha/alpha.module';


// routing
import { routing } from './orders.routing';

// components
import * as fromComponents from './components';

// containers
import * as fromContainers from './containers';

// dependency
import { FulfillmentsFormModule } from '../fulfillments/shared/fulfillments-form.module';
import { FulfillmentsFormDialogComponent } from '../fulfillments/components/fulfillments-form-dialog/fulfillments-form-dialog.component';
import { AgGridModule } from 'ag-grid-angular';
import { TableOrderlinesCellComponent, TableActionCellComponent, TableStatusCellComponent } from './components';
import { FulfillmentsBulkDialogComponent } from '../fulfillments/components/fulfillments-bulk-dialog/fulfillments-bulk-dialog.component';

// tslint:disable-next-line:import-spacing
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
// import { OrderUploadComponent } from './orderupload/orderupload.component';
import { FileUtil } from './containers/order-new/orderupload.util';
import { Constants } from './containers/order-new/orderupload.constants';

@NgModule({
  imports: [
    SharedModule,
    FuseMainModule,
    routing,
    BasicModule,
    AlphaModule,
    FulfillmentsFormModule,
    AgGridModule.withComponents([TableOrderlinesCellComponent, TableActionCellComponent, TableStatusCellComponent]),
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    HttpModule
  ],
  declarations: [
    fromComponents.components,
    fromContainers.containers,
    FulfillmentsBulkDialogComponent
    // OrderUploadComponent
  ],
  entryComponents: [
    fromComponents.OrderSearchDialogComponent,
    FulfillmentsFormDialogComponent,
    FulfillmentsBulkDialogComponent
  ],
  providers: [
    FileUtil,
    Constants
  ]
})

export class OrdersModule {}




