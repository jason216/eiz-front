import { ConsignmentsPrintedComponent } from './consignments-printed/consignments-printed.component';
import { ConsignmentsSolidComponent } from './consignments-solid/consignments-solid.component';
import { ConsignmentsErrorComponent } from './consignments-error/consignments-error.component';
import { TableActionCellComponent } from './table-cell/table-action-cell/table-action-cell.component';
// import { ConsignmentsComponent } from './consignments.component';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { SharedModule } from '../../../../app/core/modules/shared.module';
import { FuseMainModule } from '../../../../app/main/main.module';
import { BasicModule } from '../../../../app/basic/basic.module';
import { ConsignmentsAllComponent } from './consignments-all/consignments-all.component';
import { ConsignmentsComponent as ConsignmentsComponent_fastway} from '../../../fastway/containers/consignments/consignments.component';
import { Routes, RouterModule } from '@angular/router';
import { ConsignmentsSideNavComponent } from './side-nav/side-nav.component';
import { AgGridModule } from 'ag-grid-angular';
import { ConsignmentsPendingComponent } from './consignments-pending/consignments-pending.component';
import { ConsignmentNewComponent } from '../consignment-new/consignment-new.component';
import { ConsignmentsService } from '../../services/consignments.service';
import { NumberOnlyDirective } from '../../../../app/alpha/services/number-only.directive';
import { ConsignmentEditDialogComponent } from './consignment-edit/consignment-edit.component';
import { FastwayConsignmentsComponent } from './fastway.consignments.component';
import { EparcelConsignmentsComponent } from './eparcel/eparcel.consignments.component';

const routes: Routes = [
  // {
    // path: '',
    // component: ConsignmentsAllComponent,
    // children: [
      {
        path: '',
        component: ConsignmentsAllComponent,
      },
      {
        path: 'pending',
        component: ConsignmentsPendingComponent,
      },
      {
        path: 'error',
        component: ConsignmentsErrorComponent,
      },
      {
        path: 'solid',
        component: ConsignmentsSolidComponent,
      },
      {
        path: 'printed',
        component: ConsignmentsPrintedComponent,
      },
      {
        path: 'fastway',
        component: FastwayConsignmentsComponent,
      },
      {
        path: 'eparcel',
        component: EparcelConsignmentsComponent,
      },
    // ]
  // },
];

@NgModule({
  imports: [
    SharedModule,
    FuseMainModule,
    BasicModule,
    RouterModule.forChild(routes),
    AgGridModule.withComponents([TableActionCellComponent]),
  ],
  declarations: [
    ConsignmentsAllComponent,
    ConsignmentsPendingComponent,
    ConsignmentsErrorComponent,
    ConsignmentsSolidComponent,
    ConsignmentsPrintedComponent,
    // ConsignmentsComponent,
    ConsignmentsSideNavComponent,
    ConsignmentsComponent_fastway,
    TableActionCellComponent,
    ConsignmentNewComponent,
    ConsignmentEditDialogComponent,
    FastwayConsignmentsComponent,
    EparcelConsignmentsComponent,
    NumberOnlyDirective
  ],
  exports: [
    RouterModule,
  ],
  entryComponents: [
    ConsignmentEditDialogComponent,
  ],
  providers: [
    ConsignmentsService
  ]
})

export class ConsignmentsModule {}




