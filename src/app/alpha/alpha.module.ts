import { NgModule, ModuleWithProviders } from '@angular/core';

import * as fromServices from './services/';

@NgModule({
})
export class AlphaModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AlphaModule,
      providers: [fromServices.services]
    };
  }
}
