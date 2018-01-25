import { NgModule } from '@angular/core';

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

@NgModule({
  imports: [
    SharedModule,
    FuseMainModule,
    routing,
    BasicModule,
    AlphaModule,
    FulfillmentsFormModule
  ],
  declarations: [
    fromComponents.components,
    fromContainers.containers
  ],
  entryComponents: [
    fromComponents.OrderSearchDialogComponent,
    FulfillmentsFormDialogComponent
  ]
})

export class OrdersModule {}




