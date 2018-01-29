import { ConsignmentsComponent } from './consignments.component';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { SharedModule } from '../../../../app/core/modules/shared.module';
import { FuseMainModule } from '../../../../app/main/main.module';
import { BasicModule } from '../../../../app/basic/basic.module';
import { ConsignmentsAllComponent } from './consignments-all/consignments-all.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ConsignmentsComponent,
    children: [
      {
        path: '',
        component: ConsignmentsAllComponent,
      }
    ]
  },
];

@NgModule({
  imports: [
    SharedModule,
    FuseMainModule,
    BasicModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    ConsignmentsAllComponent,
    ConsignmentsComponent,
  ],
  exports: [
    RouterModule,
  ],
  entryComponents: [

  ]
})

export class ConsignmentsModule {}




