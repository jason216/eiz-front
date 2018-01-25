import { NgModule } from '@angular/core';

// components
import * as fromComponents from '../components';
import { SharedModule } from '../../../app/core/modules/shared.module';
import { FuseMainModule } from '../../../app/main/main.module';
import { BasicModule } from '../../../app/basic/basic.module';
import { AlphaModule } from '../../../app/alpha/alpha.module';


@NgModule({
  imports: [
    SharedModule,
    BasicModule,
    AlphaModule
  ],
  declarations: [
    fromComponents.fulfillmentsFormComponents,
  ],
  exports: [
    fromComponents.FulfillmentsFormComponent
  ],
  entryComponents: [
  ]
})

export class FulfillmentsFormModule {}




