import { FuseNavigationModelInterface } from './../../core/components/navigation/navigation.model';
import { FuseNavigationService } from './../../core/components/navigation/navigation.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { PluginNavListModel } from './../../navigation/plugin-nav-list.model';

@Injectable()
export class MenuService {

  menuRef = new PluginNavListModel().model;

  constructor(){ }

  public getUserMenu() {
    return this.decodeMenu([
      {
        id: 'orders',
        children: [{ id: 'orders.new' }, { id: 'orders.all' }]
      },
      {
        id: 'fulfillments',
        children: [{ id: 'fulfillments.all' }, { id: 'fulfillments.new' }]
      }
    ]);
    // this.apiService.get("user", 'nav').subscribe(
    //   res => {
    //     if (res['data']) {
    //       //this.setSession(res['data']);
    //     }
    //   },
    //   err => {
    //     console.log(`Error in get menu: ${err}`);
    //   },
    //   () => {
    //     console.log('get server side menu Completed');
    //   }
    // );
  }

  decodeMenu(data: any[]){
    let newMenu = [];

    data.forEach(root => {
      console.log('root is ', root);

      let rootMenu = this.findMenuInRef(root['id']);
      console.log('root menu is', rootMenu);

      if (typeof root['children'] === 'undefined'){
      }else{

        root['children'].forEach(middle => {
          console.log('middle is ', middle);

          let midMenu = this.findMenuInRef(middle['id']);
          console.log('middle Menu1 is ', midMenu);

          if (typeof middle['children'] === 'undefined') {}
          else{
            console.log('start loop' );
            middle['children'].forEach(leaf => {
              console.log('leaf is ', leaf);
              let leafMenu = this.findMenuInRef(leaf['id']);
              midMenu['children'].push(leafMenu);
            });
            console.log('end loop');
          }


          console.log('middle Menuis ', midMenu);
          console.log('root menu is', rootMenu);
          rootMenu['children'].push(midMenu);
        });

      }

      newMenu.push(rootMenu);
    });
    console.log(newMenu);

    return {'model': newMenu};
  }

  private findMenuInRef(id) {
    let menu;
    this.menuRef.forEach(element => {
      if ( element['id'] === id ){

        menu = element;
      }
    });
    console.log('find menu is ', menu);
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
