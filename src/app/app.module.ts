import { MenuService } from './alpha/services/menu.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'hammerjs';
import { SharedModule } from './core/modules/shared.module';
import { AppComponent } from './app.component';
import { FuseMainModule } from './main/main.module';
import { FuseSplashScreenService } from './core/services/splash-screen.service';
import { FuseConfigService } from './core/services/config.service';
import { FuseNavigationService } from './core/components/navigation/navigation.service';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DndModule } from 'ng2-dnd';

// ours
import { AlphaModule } from './alpha/alpha.module';
import { BasicModule } from './basic/basic.module';
import { RoutesModule } from './routes/routes.module';
import { ApiHeaderInterceptor } from './alpha/services/interceptor/api-header.interceptor';

import { AuthService } from './alpha/services';
import { ActiveContentService } from './alpha/services/activeContent.service';
import { UserService } from './basic/user-setting/user.service';
import { InputNumberDirective } from './alpha/services/input-number.directive';
@NgModule({
  declarations: [
    AppComponent,
    InputNumberDirective
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule,
    TranslateModule.forRoot(),
    FuseMainModule,
    RoutesModule,
    AlphaModule.forRoot(),
    BasicModule,
    NgxDatatableModule,
    DndModule.forRoot()
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiHeaderInterceptor,
      multi: true
    },

    ActiveContentService,
    FuseSplashScreenService,
    FuseConfigService,
    FuseNavigationService,
    MenuService,
    AuthService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
