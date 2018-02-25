import { NgModule } from '@angular/core';

// components
import * as fromComponents from '../components';
import { SharedModule } from '../../../app/core/modules/shared.module';
import { FuseMainModule } from '../../../app/main/main.module';
import { BasicModule } from '../../../app/basic/basic.module';
import { AlphaModule } from '../../../app/alpha/alpha.module';
import { DndModule } from 'ng2-dnd';


@NgModule({
  imports: [
    SharedModule,
    BasicModule,
    AlphaModule,
    DndModule
  ],
  declarations: [
    fromComponents.fulfillmentsFormComponents,
  ],
  exports: [
    fromComponents.FulfillmentsFormComponent,
    DndModule
  ],
  entryComponents: [
  ]
})

export class FulfillmentsFormModule {}




