import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import { ApiService } from '../../../app/alpha/services/api.service';


@Injectable()
export class FulfillmentsService {

  constructor(private apiService: ApiService) {}

  public getFulfillments(params?: string): Observable<any> {
    return this.apiService.get("fulfillments", "fulfillments", params);
  }

  public newFulfillment(data: any) {
    this.apiService.post("fulfillments", "fulfillments", data).subscribe(
      res => {
        if (res["data"]) {
          console.log("order create return ", res["data"]);
        }
      },
      err => {
        console.log(`Error in order create: ${err}`);
      },
      () => {
        console.log("order create Completed");
      }
    );
  }

  public getConsignment(params?: string): Observable<any> {
    return this.apiService.get("fulfillments", "consignments", params);
  }

  public solidConsignment(data: any) {
    this.apiService.post("fulfillments", "solidConsignments", data).subscribe(
      res => {
        if (res["data"]) {
          console.log("solid consignment return ", res["data"]);
        }
      },
      err => {
        console.log(`Error in solid consignment: ${err}`);
      },
      () => {
        console.log("solid consignment Completed");
      }
    );
  }
}
