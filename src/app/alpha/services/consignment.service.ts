import { ConsignmentsService } from './consignments.service';
import { Consignment } from './../models/consignment.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import { ApiService } from '../../../app/alpha/services/api.service';


@Injectable()
export class ConsignmentService {
  private currentConsignment: Consignment;
  private originalConsignment: Consignment;

  constructor(private consignmentsService: ConsignmentsService) {}

  set consignment (data: Consignment) {
    this.originalConsignment = data;
    this.currentConsignment = data.clone();
  }

  get consignment(): Consignment {
    return this.currentConsignment;
  }

  restoreConsignment() {
    this.consignment = this.originalConsignment;
  }

  saveConsignment() {
    this.consignment = this.currentConsignment;
    this.consignmentsService.saveConsignment(this.currentConsignment).subscribe();
  }

}
