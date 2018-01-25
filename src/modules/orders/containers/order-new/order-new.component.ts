import { Component, OnInit, OnDestroy } from '@angular/core';

import { fuseAnimations } from '../../../../app/core/animations';

@Component({
  selector: 'page-order-new',
  templateUrl: './order-new.component.html',
  styleUrls: ['./order-new.component.scss'],
  animations: fuseAnimations
})

export class OrderNewComponent implements OnInit, OnDestroy {
  private startSubscribe: boolean = true;

  constructor(
  ){

  }
  ngOnInit() {
  }

  ngOnDestroy() {
    this.startSubscribe = false;
  }
}
