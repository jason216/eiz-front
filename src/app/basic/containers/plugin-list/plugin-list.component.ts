import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'plugin-list',
  templateUrl: './plugin-list.component.html'
})
export class PluginListComponent {
  plugin = {
    id: 1,
    name: 'Orders Module',
    code: 'order',
    img: '/assets/images/cards/card2.jpg',
    highlight: 'Processing Orders $20/year',
    setting: true,
    subscribed: true,
    dependency: [1, 2, 3, 4, 5],
    detail:
      // tslint:disable-next-line:max-line-length
      'Card content that exceeds the maximum card height is truncated and does not scroll, but the card can be expanded. Once expanded,the card may exceed the maximum height of the view. In this case, the card will scroll with the card collection.'
  };

  plugin2 = {
    name: 'Orders Module 32',
    code: 'order',
    img: 'assets/images/cards/card2.jpg',
    highlight: 'Processing Orders $20/year',
    setting: true,
    subscribed: true,
    detail:
      // tslint:disable-next-line:max-line-length
      'Card content that exceeds the maximum card height is truncated and does not scroll, but the card can be expanded. Once expanded,the card may exceed the maximum height of the view. In this case, the card will scroll with the card collection.'
  };

  constructor(private router: Router) {}
}
