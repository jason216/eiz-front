import { MenuService } from './menu.service';
import { Injectable } from '@angular/core';
// tslint:disable-next-line:import-blacklist
import { Observable, Subscription } from 'rxjs';
import 'rxjs/add/observable/fromPromise';
import { ApiService } from '../../../app/alpha/services/api.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Consignment } from '../models/consignment.model';


@Injectable()
export class ActiveContentService {

  orders: any = {};
  consignments: any = {};
  private subscription: Subscription;
  // private onChangeSubscription: Subscription;
  public onChanges: BehaviorSubject<any> = new BehaviorSubject({});
  public onOrdersChange: BehaviorSubject<any> = new BehaviorSubject({});
  public onConsignmentsChange: BehaviorSubject<any> = new BehaviorSubject({});


  constructor(
    private apiService: ApiService,
  ){
    this.initialOrders();
    this.initialConsigments();
  }

  public startActiveContent(){
    this.getOrders();
    this.getConsignments();
    this.subscription = Observable.interval(30000).subscribe((v) => {
      this.getOrders();
      this.getConsignments();
    });
  }

  public endActiveContent(){
    this.subscription.unsubscribe();
  }

  public getOrders(){
      this.apiService.get('orders', 'orders', null, {size: 99999, 'ex_tags[]': 1}).subscribe(
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
          this.onChanges.next(true);
        }
      );
  }

  public getConsignments(){
    this.apiService.get('Fulfillments', 'consignments', null, {}).subscribe(
      res => {
        this.initialConsigments();
        this.consignments.all = res.data;
        this.consignments.all.forEach(consignment => {
          if (!consignment.processed){
            this.consignments.pending.push(consignment);
          }else if (consignment.errors){
            this.consignments.issue.push(consignment);
          }else if (!consignment.printed){
            this.consignments.solid.push(consignment);
          }else{
            this.consignments.printed.push(consignment);
          }
        });
        this.onConsignmentsChange.next(this.consignments);
        this.onChanges.next(true);
      }
    );
  }

  public getData(){
    return {
      consignments: this.consignments,
      orders: this.orders
    };
  }

  initialOrders(){
    this.orders.all = [];
    this.orders.hold = [];
    this.orders.awaitFulfill = [];
    this.orders.unpaid = [];
  }

  initialConsigments(){
    this.consignments.all = [];
    this.consignments.pending = [];
    this.consignments.issue = [];
    this.consignments.solid = [];
    this.consignments.printed = [];
  }

}
