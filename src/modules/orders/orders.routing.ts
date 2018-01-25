
import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

// containers
import * as fromContainers from './containers';


const routes: Routes = [
  { path: 'all', component: fromContainers.OrderListComponent },
  { path: 'new', component: fromContainers.OrderNewComponent }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
