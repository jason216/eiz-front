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
  ) {

  }

  getConsignments(){
    this.apiService.get('Fulfillments', 'consignments').subscribe(
      (res) => {
        this.onConsignmentsUpdate.next(res);
      }
    );
  }
}
