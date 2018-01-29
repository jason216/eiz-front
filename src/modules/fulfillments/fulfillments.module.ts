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


@NgModule({
  imports: [
    SharedModule,
    FuseMainModule,
    routing,
    BasicModule,
    AlphaModule,
    FulfillmentsFormModule,
    ConsignmentsModule,
  ],
  declarations: [
    fromComponents.components,
    fromContainers.containers
  ],
  exports: [
    fromComponents.FulfillmentsFormComponent
  ],
  entryComponents: [
    fromComponents.FulfillmentsDespatchDialogComponent
  ]
})

export class FulfillmentsModule {}




