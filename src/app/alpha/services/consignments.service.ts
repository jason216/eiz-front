import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import { ApiService } from '../../../app/alpha/services/api.service';
import { Consignment } from '../models/consignment.model';
import { Observer } from 'rxjs/Observer';

@Injectable()
export class ConsignmentsService {
  consignments: Consignment[] = [];

  constructor() {}

  get allConsignments(){
    return this.consignments;
  }
  deleteConsignments() {
    this.consignments = [];
  }
  getConsignment(id): Observable<Consignment> {
    return new Observable<Consignment>((observer: Observer<Consignment>) => {
      const foundItem = this.consignments.find(t => t.id === id);
      // if can not find item in array return a new item
      observer.next(foundItem || new Consignment(id));
      observer.complete();
    });
  }
  getConsignments(): Observable<Consignment[]> {
    return new Observable<Consignment[]>((observer: Observer<Consignment[]>) => {
      observer.next(this.consignments);
      observer.complete();
    });
  }
  saveConsignment(consignment: Consignment): Observable<Consignment> {
    return new Observable<Consignment>((observer: Observer<Consignment>) => {
      const foundItem = this.consignments.find(t => t.id === consignment.id);
      if (foundItem) {
        consignment = Object.assign(foundItem, consignment); // update consignment in array
      } else {
        this.consignments.push(consignment); // put new consignment to array
      }
      observer.next(consignment);
      observer.complete();
    });
  }

  getConsignmentTotalCost(): Observable<number> {
    let cost = 0;
    return new Observable<number>((observer: Observer<number>) => {
      for (const consignment of this.consignments){
        cost = cost + consignment.shippingMethod_cost;
      }
      observer.next(cost);
      observer.complete();
    });
  }
}
