import { Component, OnInit } from '@angular/core';
import { FuseConfigService } from '../../../core/services/config.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {

  constructor(
    private fuseConfig: FuseConfigService
  )
  {
      this.fuseConfig.setSettings({
          layout: {
              navigation: 'none',
              toolbar   : 'none',
              footer    : 'none'
          }
      });
  }

  ngOnInit() {
  }

}
