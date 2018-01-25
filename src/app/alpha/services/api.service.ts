import { HttpClient, HttpParams, HttpErrorResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class ApiService {
  private url: string;
  private activeRequests = 0;

  constructor(private httpClient: HttpClient) {
    this.url = environment.apiUrl;
  }
  public get(endpoint: string, target: string, params?: string): Observable<any> {

    let resourceUrl = this.url + '/' + endpoint + '/' + target;
    let httpParams: HttpParams;
    if (params) {
      httpParams = new HttpParams({fromString: params});
      resourceUrl = this.url + '/' + endpoint + '/' + target + '?' + params;
    }

    if (endpoint === 'auth') {
      resourceUrl = this.url + '/' + target;
    }
    ++this.activeRequests;

    return this.httpClient
            .get(resourceUrl, {params: httpParams} )
      .catch((error: any) => this.handleError(error));
  }

  public post(endpoint: string, target: string, data?: any): Observable<any> {

    let resourceUrl = this.url + '/' + endpoint + '/' + target;
    if (endpoint === 'auth') {
      resourceUrl = this.url + '/' + target;
    }
    ++this.activeRequests;

    return this.httpClient
            .post(resourceUrl, data)
      .catch((error: HttpErrorResponse) => this.handleError(error));
      //      .pipe(catchError((error: HttpErrorResponse) => this.handleError(error)));
  }
  private handleError(error: HttpErrorResponse) {
    error = error.error;
    let errMsg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error' ;

    return Observable.throw(errMsg);
  }
  public isLoading() {
    return (this.activeRequests > 0 ? true : false);
  }

  private loadingDone() {
    if (--this.activeRequests < 0) {
      this.activeRequests = 0;
    }
  }
}
