
import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

// containers
import * as fromFulfillmentsContainers from './containers';
import { ConsignmentNewComponent } from './containers/consignment-new/consignment-new.component';


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
  },
  {
    path: 'consignments',
    loadChildren: './containers/consignments/consignmentsModule#ConsignmentsModule'
  },
  {
    path: 'consignment/new',
    component: ConsignmentNewComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
