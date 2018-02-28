import { MenuService } from './menu.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import { ApiService } from '../../../app/alpha/services/api.service';


@Injectable()
export class ActiveContentService {

  orders = [];

  constructor(
    private apiService: ApiService,

  ){
    this.getOrders();
  }

  public getOrders(){
      this.apiService.get('orders', 'orders', null, {size: 99999}).subscribe(
        res => {
          this.orders = res.data;
          // this.menuService.loadFromRemote();
        }
      );
  }

}
