import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { UserSettingComponent } from '../basic/user-setting/user-setting.component';
import { PageNotFoundComponent } from './error/page-not-found/page-not-found.component';
import { FuseMainComponent } from '../main/main.component';
import { AuthGuard } from '../alpha/services/guard/auth.guard';
import { PluginsComponent } from '../basic/plugins/plugins.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: '',
    redirectTo: 'settings',
    pathMatch: 'full'
  },
  {
    path: 'settings',
    component: UserSettingComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'plugins',
    component: PluginsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'orders',
    loadChildren: './../../modules/orders/orders.module#OrdersModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'fulfillments',
    loadChildren:
      './../../modules/fulfillments/fulfillments.module#FulfillmentsModule',
    canActivate: [AuthGuard]
  },
  {
    path: '404',
    component: PageNotFoundComponent
  },
  {
    path: '**',
    redirectTo: '404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RoutesRoutingModule{}
