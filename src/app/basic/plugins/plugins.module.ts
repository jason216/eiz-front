import { NgModule } from '@angular/core';
import { SharedModule } from '../../core/modules/shared.module';
import { Routes, RouterModule } from '@angular/router';

import { PluginsComponent } from './plugins/plugins.component';
import { SubscribePluginComponent } from './subscribePugin/subscribePlugin.component';
import { PluginsService } from './plugins.service';
import { ApiService } from '../../alpha/services/api.service';

const routes: Routes = [
    {
        path     : '',
        component: PluginsComponent,
        resolve  : {
            academy: PluginsService
        }
    },
    {
        path     : 'subscribe',
        component: SubscribePluginComponent,
        children: [
          {
            path: 'fulfillments',
            loadChildren: '../../../modules/fulfillments/fulfillments.module#FulfillmentsModule',
          }
        ]
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
      ApiService
    ]
})
export class PluginsModule
{
}
