import { ActiveContentService } from './../../../app/alpha/services/activeContent.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import { ApiService } from '../../../app/alpha/services/api.service';
import { Observer } from 'rxjs/Observer';
import { EventEmitter } from '@angular/core/src/event_emitter';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class ConsignmentsService {

  onConsignmentsUpdate: BehaviorSubject<any> = new BehaviorSubject({});

  constructor(
    private apiService: ApiService,
    private activeContentService: ActiveContentService,
  ) {

  }

  printConsignments(ids: any[]){
    this.apiService.get('Fulfillments', 'printConsignments', null, {'ids[]': ids}).subscribe(
      (res) => {
        window.open(res.data.url);
        this.activeContentService.getConsignments();
      }
    );
  }

  // solidConsignments(ids: any[]): Observable<any> {
  //   return this.apiService.post('Fulfillments', 'solidConsignments', null, {'ids[]': ids});
  // }

  solidConsignments(ids: any[]) {
      this.apiService.post('Fulfillments', 'solidConsignments', null, {'ids[]': ids}).subscribe(
        (res) => {
          this.printConsignments(ids);
          this.activeContentService.getConsignments();
        }
    );
  }

  submitEparcelConsignments(ids: any[]): Observable<any> {
    return this.apiService.post('eParcel', 'submit', null, {'ids[]': ids});
  }

  submitFastwayConsignments(ids: any[]){
    this.apiService.post('Fastway', 'submit', null, {'ids[]': ids}).subscribe(
      (res) => {
        this.activeContentService.getConsignments();
      }
    );
  }

  editConsignment(consignmentId: any, formVal: any): Observable<any> {
    return this.apiService.put('Fulfillments', 'consignment', consignmentId, formVal);
  }
}
