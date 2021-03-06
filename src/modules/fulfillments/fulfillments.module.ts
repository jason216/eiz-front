import { NgModule, ModuleWithProviders } from '@angular/core';

import { SharedModule } from '../../app/core/modules/shared.module';
import { FuseMainModule } from '../../app/main/main.module';
import { BasicModule } from '../../app/basic/basic.module';
import { AlphaModule } from '../../app/alpha/alpha.module';

// routing
import { routing } from './fulfillments.routing';

// components
import * as fromComponents from './components';

// containers
import * as fromContainers from './containers';

// shared
import { FulfillmentsFormModule } from './shared/fulfillments-form.module';
import { ConsignmentsModule } from './containers/consignments/consignmentsModule';
import { DndModule } from 'ng2-dnd';
import { AgGridModule } from 'ag-grid-angular';
import { TableActionCellComponent } from './containers/consignments/table-cell/table-action-cell/table-action-cell.component';
import { FileUtil } from './containers/consignment-new/orderupload.util';
import { Constants } from './containers/consignment-new/orderupload.constants';


@NgModule({
  imports: [
    SharedModule,
    FuseMainModule,
    routing,
    BasicModule,
    AlphaModule,
    FulfillmentsFormModule,
    ConsignmentsModule,
    DndModule,
  ],
  declarations: [
    fromComponents.components,
    fromContainers.containers,
  ],
  exports: [
    fromComponents.FulfillmentsFormComponent,
    DndModule
  ],
  entryComponents: [
    fromComponents.FulfillmentsDespatchDialogComponent
  ],
  providers: [
    FileUtil,
    Constants
  ]
})

export class FulfillmentsModule {}




