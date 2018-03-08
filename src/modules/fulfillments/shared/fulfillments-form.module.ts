import { NgModule } from '@angular/core';

// components
import * as fromComponents from '../components';
import { SharedModule } from '../../../app/core/modules/shared.module';
import { FuseMainModule } from '../../../app/main/main.module';
import { BasicModule } from '../../../app/basic/basic.module';
import { AlphaModule } from '../../../app/alpha/alpha.module';
import { DndModule } from 'ng2-dnd';
import { FulfillmentsSelectAddressDialogComponent } from '../components/fulfillments-selectAddress-dialog/fulfillments-selectAddress-dialog.component';

import { AgmCoreModule } from '@agm/core';


@NgModule({
  imports: [
    SharedModule,
    BasicModule,
    AlphaModule,
    DndModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyD81ecsCj4yYpcXSLFcYU97PvRsE_X8Bx8'
    })
  ],
  declarations: [
    fromComponents.fulfillmentsFormComponents,
    FulfillmentsSelectAddressDialogComponent
  ],
  exports: [
    fromComponents.FulfillmentsFormComponent,
    DndModule,
  ],
  entryComponents: [
    FulfillmentsSelectAddressDialogComponent
  ]
})

export class FulfillmentsFormModule {}




