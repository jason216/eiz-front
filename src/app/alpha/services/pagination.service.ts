import { Injectable } from '@angular/core';

import { Page } from '../models/page.model';
import { PagedData } from '../models/page-data.model';

@Injectable()
export class PaginationService {

  constructor() { }

  public decodeResponse(response: any): PagedData<any>{
    const pagedData = new PagedData<any>();
    pagedData.page.size = response['per_page'];
    pagedData.page.totalElements = response['total'];
    pagedData.page.totalPages = response['last_page'];
    pagedData.page.pageNumber = response['current_page'];
    // response['from'] = response['current_page'];
    // response['to'] = response['next_page'];
    // response['frist_page_url']
    // response['last_page_url']
    // response['next_page_url']
    // response['prev_page_url']

    pagedData.data = response['data'];
    console.log('getServer current page', pagedData.page);

    return pagedData;
  }

  public encodeResponse(nextPage: number): string {
    return 'page=' + nextPage;
  }

}
