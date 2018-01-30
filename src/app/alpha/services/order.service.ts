import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import { ApiService } from '../../../app/alpha/services/api.service';


@Injectable()
export class OrderService {

  constructor(private apiService: ApiService){}

  public getOrders(params?: any): Observable<any>{
      return this.apiService.get('orders', 'orders', null, params);
  }

  public newOrder(data: any) {
    this.apiService.post('orders', 'orders', null, data).subscribe(
      res => {
        if (res['data']) {
          console.log('order create return ', res['data']);
        }
      },
      err => {
        console.log(`Error in order create: ${err}`);
      },
      () => {
        console.log('order create Completed');
      }
    );
  }

}
