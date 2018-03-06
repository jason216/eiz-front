import { MenuService } from './menu.service';
import { Injectable } from '@angular/core';
// tslint:disable-next-line:import-blacklist
import { Observable, Subscription } from 'rxjs';
import 'rxjs/add/observable/fromPromise';
import { ApiService } from '../../../app/alpha/services/api.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class ActiveContentService {

  orders: any = {};
  private subscription: Subscription;
  public onOrdersChange: BehaviorSubject<any> = new BehaviorSubject({});


  constructor(
    private apiService: ApiService,
  ){
    this.initialOrders();
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
          this.initialOrders();
          this.orders.all = res.data;
          this.orders.all.forEach(order => {
            order.tags.forEach(tag => {
              switch (tag.id){
                case 4: {
                  this.orders.hold.push(order);
                  break;
                }
                case 3: {
                  this.orders.awaitFulfill.push(order);
                  break;
                }
                default: {
                  this.orders.unpaid.push(order);
                  break;
                }

              }
            });
          });
          this.onOrdersChange.next(this.orders);
        }
      );
  }

  initialOrders(){
    this.orders.all = [];
    this.orders.hold = [];
    this.orders.awaitFulfill = [];
    this.orders.unpaid = [];
  }

}
