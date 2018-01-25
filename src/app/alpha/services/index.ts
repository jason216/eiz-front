import { PaginationService } from './pagination.service';
import { FulfillmentsService } from './fulfillments.service';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { MenuService } from './menu.service';
import { OrderService } from './order.service';
import { ConsignmentsService } from './consignments.service';
import { ConsignmentService } from './consignment.service';
import { AuthGuard } from './guard/auth.guard';



export const services: any[] = [
  ApiService,
  AuthService,
  MenuService,
  PaginationService,
  OrderService,
  FulfillmentsService,
  ConsignmentsService,
  ConsignmentService,
  AuthGuard
];

export * from './pagination.service';
export * from './fulfillments.service';
export * from './api.service';
export * from './auth.service';
export * from './menu.service';
export * from './order.service';
export * from './consignments.service';
export * from './consignment.service';
