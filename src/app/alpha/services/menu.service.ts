import { FuseNavigationModelInterface } from './../../core/components/navigation/navigation.model';
import { FuseNavigationService } from './../../core/components/navigation/navigation.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { PluginNavListModel } from './../../navigation/plugin-nav-list.model';

@Injectable()
export class MenuService {

  menuRef = new PluginNavListModel().model;

  constructor(
    private fuseNavigationService: FuseNavigationService,
    private apiService: ApiService,
  ){ }

  public loadFromRemote() {

    const defaultMenu = [
      {
        id: 'orders',
        children: [{ id: 'orders.new' }, { id: 'orders.all' }]
      },
      {
        id: 'fulfillments',
        children: [{ id: 'fulfillments.all' }, { id: 'fulfillments.new' }, { id: 'fulfillments.despatch' }]
      }
    ];

    this.apiService.get('user', 'nav').subscribe(
      res => {
        if (res['data']) {
          this.fuseNavigationService.setNavigationModel(res['data']);
        }
      },
      err => {
        this.fuseNavigationService.setNavigationModel(this.decodeMenu(defaultMenu));
      },
      () => {
        this.fuseNavigationService.setNavigationModel(this.decodeMenu(defaultMenu));
      }
    );
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
