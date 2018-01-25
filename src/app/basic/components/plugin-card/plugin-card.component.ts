import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { fuseAnimations } from './../../../core/animations';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'plugin-card',
  templateUrl: './plugin-card.component.html',
  animations: fuseAnimations
})
export class PluginCardComponent {
  @Input() plugin;

  constructor(private router: Router) {

  }

  openSetting(){
    const url = '/' + this.plugin.code + '/setting';
    this.router.navigate([url]);
  }

  changeSubscribed(){
    // first connent to API
    if (this.plugin.subscribed){
      this.plugin.subscribed = false;
    }else{
      this.plugin.subscribed = true;
    }
  }

}
