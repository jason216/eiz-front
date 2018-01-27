import { NgModule, ModuleWithProviders } from '@angular/core';

import { SharedModule } from '../../app/core/modules/shared.module';
import { FuseMainModule } from '../../app/main/main.module';
import { BasicModule } from '../../app/basic/basic.module';
import { AlphaModule } from '../../app/alpha/alpha.module';

// routing
import { routing } from './fastway.routing';



@NgModule({
  imports: [
    SharedModule,
    FuseMainModule,
    routing,
    BasicModule,
    AlphaModule,
  ],
  declarations: [

  ],
  exports: [

  ],
  entryComponents: [

  ]
})

export class FulfillmentsModule {}




