import { ActiveContentService } from './../alpha/services/activeContent.service';
import { FuseNavigationModelInterface } from '../core/components/navigation/navigation.model';

export class PluginNavListModel implements FuseNavigationModelInterface{

  public model: any[];

  constructor(
    public data: any,
  ) {
    this.model = [
      {
        'id': 'orders',
        'title': 'orders',
        'type' : 'group',
        'children': []
      },
      {
        'id': 'orders.all',
        'title': 'Order List',
        'type': 'item',
        'icon': 'email',
        'url': '/orders/all',
        'badge'    : {
          'title'    : data.orders.all.length,
          'bg'       : '#F44336',
          'fg'       : '#FFFFFF'
        }
      },
      {
        'id': 'orders.new',
        'title': 'New Order',
        'type': 'item',
        'icon': 'email',
        'url': '/orders/new',
      },
      {
        'id': 'fulfillments',
        'title': 'Fulfillments',
        'type' : 'group',
        'children': []
      },
      {
        'id': 'fulfillments.all',
        'title': 'Fulfillments list',
        'type': 'item',
        'icon': 'email',
        'url': '/fulfillments/all',
      },
      {
        'id': 'fulfillments.new',
        'title': 'New Fulfillments',
        'type': 'item',
        'icon': 'email',
        'url': '/fulfillments/new',
      },
      {
        'id': 'fulfillments.despatch',
        'title': 'Despatch',
        'type': 'item',
        'icon': 'email',
        'url': '/fulfillments/despatch',
      },
      {
        'id': 'fulfillments.consignments',
        'title': 'Consignments',
        'type': 'item',
        'icon': 'email',
        'url': '/fulfillments/consignments',
        'badge'    : {
          'title'    : data.consignments.all.length,
          'bg'       : '#F44336',
          'fg'       : '#FFFFFF'
        }
      },
    ];
  }
}
