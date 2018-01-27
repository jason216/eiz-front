
import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

// containers
import * as fromFulfillmentsContainers from './containers';


const routes: Routes = [
  {
    path: 'all',
    component: fromFulfillmentsContainers.FulfillmentsAllComponent
  },
  {
    path: 'new',
    component: fromFulfillmentsContainers.FulfillmentsNewComponent
  },
  {
    path: 'despatch',
    component: fromFulfillmentsContainers.FulfillmentsDespatchComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);