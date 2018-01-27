import { NgModule } from '@angular/core';
import { SharedModule } from '../../core/modules/shared.module';
import { RouterModule } from '@angular/router';

import { PluginsComponent } from './plugins/plugins.component';
import { PluginComponent } from './pugin/plugin.component';
import { PluginService } from './plugin.service';
import { PluginsService } from './plugins.service';
import { ApiService } from '../../alpha/services/api.service';

const routes = [
    {
        path     : '',
        component: PluginsComponent,
        resolve  : {
            academy: PluginsService
        }
    },
    {
        path     : 'plugins/:courseId/:courseSlug',
        component: PluginComponent,
        resolve  : {
            academy: PluginService
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
      PluginComponent
    ],
    providers   : [
      PluginService,
      PluginsService,
      ApiService
    ]
})
export class PluginsModule
{
}
