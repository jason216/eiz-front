import { ConsignmentsComponent } from './consignments.component';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { SharedModule } from '../../../../app/core/modules/shared.module';
import { FuseMainModule } from '../../../../app/main/main.module';
import { BasicModule } from '../../../../app/basic/basic.module';
import { ConsignmentsAllComponent } from './consignments-all/consignments-all.component';
import { ConsignmentsComponent as ConsignmentsComponent_fastway} from '../../../fastway/containers/consignments/consignments.component';
import { Routes, RouterModule } from '@angular/router';
import { ConsignmentsSideNavComponent } from './side-nav/side-nav.component';

const routes: Routes = [
  {
    path: '',
    component: ConsignmentsComponent,
    children: [
      {
        path: '',
        component: ConsignmentsAllComponent,
      },
      {
        path: 'fastway',
        component: ConsignmentsComponent_fastway,
      },
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
    ConsignmentsSideNavComponent,
    ConsignmentsComponent_fastway,
  ],
  exports: [
    RouterModule,
  ],
  entryComponents: [

  ]
})

export class ConsignmentsModule {}




