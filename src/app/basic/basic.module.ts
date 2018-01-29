import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../core/modules/shared.module';
import { UserSettingComponent } from './user-setting/user-setting.component';
import { PluginsModule } from './plugins/plugins.module';

// components
import * as fromComponents from './components';

// containers
import * as fromContainers from './containers';
import { AuthGuard } from '../alpha/services/guard/auth.guard';

@NgModule({
  imports: [
    RouterModule,
    SharedModule,
  ],
  declarations: [
    ...fromComponents.components,
    ...fromContainers.containers,
    UserSettingComponent,
  ],
  exports: [
    ...fromComponents.components,
    ...fromContainers.containers
  ],

})

export class BasicModule {
}




