import { NgModule } from '@angular/core';
import { SharedModule } from '../../core/modules/shared.module';
import { Routes, RouterModule } from '@angular/router';

import { PluginsComponent } from './plugins/plugins.component';
import { SubscribePluginComponent } from './subscribePugin/subscribePlugin.component';
import { PluginsService } from './plugins.service';
import { ApiService } from '../../alpha/services/api.service';
import { PluginService } from './plugin.service';

const routes: Routes = [
    {
        path     : 'subscribe',
        component: SubscribePluginComponent,
        children: [
          {
            path: 'fulfillments',
            loadChildren: '../../../modules/fulfillments/fulfillments.module#FulfillmentsModule',
          },
          {
            path: 'Fastway',
            loadChildren: '../../../modules/fastway/fastway.module#FastwayModule',
          },
          {
            path: 'eParcel',
            loadChildren: '../../../modules/eparcel/eparcel.module#EparcelModule',
          },
        ]
    },
    {
      path      : '',
      component: PluginsComponent,
      resolve  : {
          academy: PluginsService
      }
    },
    {
        path      : '**',
        redirectTo: ''
    }
];

@NgModule({
    imports     : [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
      PluginsComponent,
      SubscribePluginComponent,
    ],
    providers   : [
      PluginsService,
      ApiService,
      PluginService,
    ]
})
export class PluginsModule
{
}
