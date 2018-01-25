import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FuseConfigService } from '../../../core/services/config.service';
import { fuseAnimations } from '../../../core/animations';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-user-setting',
  templateUrl: './user-setting.component.html',
  styleUrls: ['./user-setting.component.scss'],
  animations: fuseAnimations
})
export class UserSettingComponent implements OnInit {

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
