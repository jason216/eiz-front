import { RoutesRoutingModule } from './routes.routing';
import { RouterModule } from '@angular/router';

import { NgModule } from '@angular/core';

import { SharedModule } from '../core/modules/shared.module';
import { BasicModule } from '../basic/basic.module';


import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { PageNotFoundComponent } from './error/page-not-found/page-not-found.component';
import { FuseShortcutsModule } from '../core/components/shortcuts/shortcuts.module';
import { FuseSearchBarModule } from '../core/components/search-bar/search-bar.module';

@NgModule({
  imports: [
    RoutesRoutingModule,
    SharedModule,
    BasicModule,
    FuseShortcutsModule,
    FuseSearchBarModule
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
    PageNotFoundComponent
  ]
})
export class RoutesModule {}
