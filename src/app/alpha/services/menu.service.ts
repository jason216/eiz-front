import { ActiveContentService } from './activeContent.service';
import { FuseNavigationModelInterface } from './../../core/components/navigation/navigation.model';
import { FuseNavigationService } from './../../core/components/navigation/navigation.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { PluginNavListModel } from './../../navigation/plugin-nav-list.model';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class MenuService {

  menuRef;
  onOrdersChangeSubscription: Subscription;
  menu;


  constructor(
    private fuseNavigationService: FuseNavigationService,
    private apiService: ApiService,
    public activeContentService: ActiveContentService
  ){
    this.menu = [
      {
        id: 'orders',
        children: [{ id: 'orders.new' }, { id: 'orders.all' }, { id: 'orders.archived' }]
      },
      {
        id: 'fulfillments',
        children: [{ id: 'fulfillments.consignments.new' }, { id: 'fulfillments.consignments' }, { id: 'fulfillments.new' }, { id: 'fulfillments.despatch' }]
      }
    ];
    this.onOrdersChangeSubscription = this.activeContentService.onChanges.subscribe(
      (res) => {
        this.setMenu();
      }
    );
  }

  public loadFromRemote() {
    this.apiService.get('user', 'nav').subscribe(
      res => {
        if (res['data']) {
          this.menu = res['data'];
        }
      },
      err => {

      },
      () => {
        this.setMenu();
      }
    );
  }

  setMenu(){
    this.menuRef = new PluginNavListModel(this.activeContentService.getData()).model;
    this.fuseNavigationService.setNavigationModel(this.decodeMenu(this.menu));
  }

  decodeMenu(data: any[]){
    const newMenu = [];

    data.forEach(root => {
      const rootMenu = this.findMenuInRef(root['id']);
      if (typeof root['children'] === 'undefined'){
      }else{
        root['children'].forEach(middle => {

          const midMenu = this.findMenuInRef(middle['id']);

          if (typeof middle['children'] === 'undefined') {}
          else{
            middle['children'].forEach(leaf => {
              const leafMenu = this.findMenuInRef(leaf['id']);
              midMenu['children'].push(leafMenu);
            });
          }
          rootMenu['children'].push(midMenu);
        });
      }
      newMenu.push(rootMenu);
    });
    return {'model': newMenu};
  }

  private findMenuInRef(id) {
    let menu;
    this.menuRef.forEach(element => {
      if ( element['id'] === id ){

        menu = element;
      }
    });
    return menu;
  }

  // public changeUserMenu() {
  //   this.apiService.post('user', 'nav').subscribe(
  //     res => {
  //       if (res['data']) {
  //         //this.setSession(res['data']);
  //       }
  //     },
  //     err => {
  //       console.log(`Error in set menu: ${err}`);
  //     },
  //     () => {
  //       console.log('set server side menu Completed');
  //     }
  //   );
  // }
}
