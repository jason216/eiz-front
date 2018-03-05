import { MenuService } from './menu.service';
import { Injectable } from '@angular/core';
// tslint:disable-next-line:import-blacklist
import { Observable, Subscription } from 'rxjs';
import 'rxjs/add/observable/fromPromise';
import { ApiService } from '../../../app/alpha/services/api.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class ActiveContentService {

  orders = [];
  private subscription: Subscription;
  public onOrdersChange: BehaviorSubject<any> = new BehaviorSubject({});
  timer = Observable.timer(0, 1000);

  constructor(
    private apiService: ApiService,
  ){

  }

  public startActiveContent(){
    this.getOrders();
    this.subscription = Observable.interval(30000).subscribe((v) => {
      this.getOrders();
    });
  }

  public endActiveContent(){
    this.subscription.unsubscribe();
  }

  public getOrders(){
      this.apiService.get('orders', 'orders', null, {size: 99999, 'tags[]': 3}).subscribe(
        res => {
          this.orders = res.data;
          this.onOrdersChange.next(this.orders);
        }
      );
  }

}
