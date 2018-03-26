import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { MailConfirmComponent } from './auth/register/mail-confirm.component';
import { UserSettingComponent } from '../basic/user-setting/user-setting.component';
import { PageNotFoundComponent } from './error/page-not-found/page-not-found.component';
import { FuseMainComponent } from '../main/main.component';
import { AuthGuard } from '../alpha/services/guard/auth.guard';
import { UserResolver } from '../basic/user-setting/user.resolve.service';
import { ActiveComponent } from './auth/register/user-active.component';

const routes: Routes = [
  {
    path: 'active',
    component: ActiveComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'register/mailconfirm',
    component: MailConfirmComponent
  },
  {
    path: '',
    redirectTo: 'orders/all',
    pathMatch: 'full'
  },
  {
    path: 'settings',
    component: UserSettingComponent,
    canActivate: [AuthGuard],
    resolve: { user: UserResolver }
  },
  {
    path: 'plugins',
    loadChildren: './../basic/plugins/plugins.module#PluginsModule',
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
  exports: [RouterModule],
  providers: [
    UserResolver
  ]
})
export class RoutesRoutingModule{}
