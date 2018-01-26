import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FuseConfigService } from '../../core/services/config.service';
import { fuseAnimations } from '../../core/animations';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-plugins',
  templateUrl: './plugins.component.html',
  styleUrls: ['./plugins.component.scss'],
  animations: fuseAnimations
})
export class PluginsComponent implements OnInit {

  constructor(
    private fuseConfig: FuseConfigService
  )
  {
      this.fuseConfig.setSettings({
          layout: {
              navigation: 'left',
              toolbar   : 'below',
              footer    : 'none'
          }
      });
  }

  ngOnInit() {
  }

}
