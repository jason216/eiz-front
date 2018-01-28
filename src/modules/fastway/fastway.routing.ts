
import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { SubscribeComponent } from './containers/subscribe/subscribe.component';



const routes: Routes = [
  {
    path: 'subscribe',
    component: SubscribeComponent
  },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
