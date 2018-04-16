
import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

// containers
import * as fromContainers from './containers';
import { OrderArchivedListComponent } from './containers/order-archived/order-archived.component';
import { AuthGuard } from '../../app/alpha/services/guard/auth.guard';


const routes: Routes = [
  { path: 'all', component: fromContainers.OrderListComponent },
  { path: 'new', component: fromContainers.OrderNewComponent },
  {
    path: 'orders/archived',
    component: OrderArchivedListComponent,
    canActivate: [AuthGuard],
  },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
